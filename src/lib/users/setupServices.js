import UserServices from './services/UserServices';
import OnBoardingServices from './services/OnBoardingServices';
import UserEnums from './enums/UserEnums';

const setupServices = ctx => {
  const { db } = ctx;
  const users = db[UserEnums.COLLECTION_NAME];
  return {
    users: new UserServices(users),
    onBoarding: OnBoardingServices,
  };
};

export default setupServices;
