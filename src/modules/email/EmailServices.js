import path from 'path';
import fs from 'fs/promises';
import nodemailer from 'nodemailer';

import SystemSettingsServices from '#modules/systemSettings/SystemSettingsServices';

const {
  frontendUrl, debug, email, disableEmail,
} = SystemSettingsServices.getSettings();
const templatesDir = 'email-templates';

// Templates are a small, fixed set of files; read each once and reuse.
const templateCache = new Map();

const loadTemplate = async (templateName, isHtml = true) => {
  const ext = isHtml ? '.html' : '.txt';
  const fileName = `${templateName}${ext}`;

  const cached = templateCache.get(fileName);
  if (cached !== undefined) return cached;

  const filePath = path.join(templatesDir, fileName);
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    templateCache.set(fileName, content);
    return content;
  } catch (err) {
    console.error(`Error loading template: ${fileName}`, err);
    throw new Error(`Template ${fileName} not found.`);
  }
};

// Reuse one pooled transporter per email-settings object instead of opening a
// fresh SMTP/TLS connection on every message. Keyed by the settings object's
// identity so it is created lazily on first send and shared thereafter.
const transporterCache = new WeakMap();

const getTransporter = emailSettings => {
  let transporter = transporterCache.get(emailSettings);
  if (!transporter) {
    transporter = nodemailer.createTransport({
      ...emailSettings,
      pool: true,
      maxConnections: 3,
    });
    transporterCache.set(emailSettings, transporter);
  }
  return transporter;
};

const replaceMustache = (template, params) => {
  let result = template;
  Object.keys(params).forEach(key => {
    const reg = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(reg, params[key]);
  });
  return result;
};

const EmailServices = {
  getMailSettings() {
    return {
      frontendUrl, debug, email,
    };
  },

  async sendMail(
    mailSettings,
    {
      to, toMany, subject, paramsToReplace, templateName,
    },
  ) {
    const { debug: showLogs, email: emailSettings } = mailSettings;

    if (showLogs) {
      console.info('Send mail to:', to, toMany);
      console.info('subject:', subject);
      console.info('paramsToReplace:', paramsToReplace);
    }

    if (!emailSettings) return { error: 'no email settings' };

    if (disableEmail) {
      console.info('Email sending disabled in settings, tried to send to', to);
      return { success: true };
    }

    const [htmlTemplate, textTemplate] = await Promise.all([
      loadTemplate(templateName, true),
      loadTemplate(templateName, false),
    ]);

    const htmlContent = replaceMustache(htmlTemplate, paramsToReplace);
    const textContent = replaceMustache(textTemplate, paramsToReplace);

    const transporter = getTransporter(emailSettings);

    try {
      const info = await transporter.sendMail({
        from: emailSettings.from,
        to: to || toMany,
        subject,
        text: textContent,
        html: htmlContent,
      });

      return { success: true, info };
    } catch (err) {
      console.error('Error sending email:', err);
      return { success: false, error: err };
    }
  },

  async sendVerificationMail(mailSettings, to, verificationToken) {
    const verificationLink = `${mailSettings.frontendUrl}/verify/${verificationToken}`;

    return this.sendMail(mailSettings, {
      to,
      subject: 'Please verify your email address',
      paramsToReplace: { verificationLink },
      templateName: 'email-verification',
    });
  },

  async sendRegistrationSuccess(mailSettings, to) {
    const loginLink = `${mailSettings.frontendUrl}/login`;

    return this.sendMail(mailSettings, {
      to,
      subject: 'Welcome!',
      paramsToReplace: { loginLink },
      templateName: 'registration-success',
    });
  },

  async sendPasswordReset(mailSettings, to, resetToken) {
    const resetLink = `${mailSettings.frontendUrl}/resetPassword/${resetToken}`;

    return this.sendMail(mailSettings, {
      to,
      subject: 'Password reset request',
      paramsToReplace: { resetLink, email: to },
      templateName: 'reset-password',
    });
  },

  async sendPasswordResetSuccess(mailSettings, to) {
    return this.sendMail(mailSettings, {
      to,
      subject: 'Password reset successfully',
      paramsToReplace: {},
      templateName: 'reset-password-success',
    });
  },
};

export default EmailServices;
