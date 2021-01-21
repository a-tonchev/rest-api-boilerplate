class EmailServices {
  static getMailSettings(ctx) {
    // Put here mail stuff you need
    return { ctx };
  }

  static async sendMail(
    mailSettings,
    {
      to, toMany, subject, paramsToReplace, templateName,
    },
  ) {
    // Put here your E-Mail logic
    console.log('Send mail to: ', to, toMany);
    console.log('subject: ', subject);
    console.log('paramsToReplace: ', paramsToReplace);
    console.log('templateName: ', templateName);
  }

  static async sendVerificationMail(mailSettings, to, verificationToken) {
    return EmailServices.sendMail(
      mailSettings,
      {
        to,
        subject: '[SomeTitle]: Please verify your email address!',
        verificationToken,
        templateName: 'email-verification',
      },
    );
  }

  static async sendRegistrationSuccess(mailSettings, to) {
    return EmailServices.sendMail(
      mailSettings,
      {
        to,
        subject: '[Some title]: Welcome!',
        paramsToReplace: {},
        templateName: 'registration-success',
      },
    );
  }

  static async sendPasswordReset(mailSettings, to, resetToken) {
    return EmailServices.sendMail(
      mailSettings,
      {
        to,
        subject: '[Some Title]: Password reset request!',
        paramsToReplace: {
          resetToken,
        },
        templateName: 'reset-password',
      },
    );
  }

  static async sendPasswordResetSuccess(mailSettings, to) {
    return EmailServices.sendMail(
      mailSettings,
      {
        to,
        subject: `[Some Title]: Password reset successfully!`,
        paramsToReplace: {},
        templateName: 'reset-password-success',
      },
    );
  }
}

export default EmailServices;
