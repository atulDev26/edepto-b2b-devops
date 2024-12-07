import { ALL_LANGUAGE, STATES } from "../api/localStorageKeys";

export const getLanguageDetailsFromId = (languageId) => {
   if (languageId) {
      let allLanguage = JSON.parse(ALL_LANGUAGE());
      for (const item of allLanguage) {
         if (item?._id === languageId) {
            return item;
         }
      }
   } else {
      return null;
   }
   return;
};

// language
export const getLanguageStringFromId = (languageId) => {
   if (languageId) {
      let allLanguage = JSON.parse(ALL_LANGUAGE());
      for (const item of allLanguage) {
         if (item?._id === languageId) {
            return item?.language
         }
      }
   } else {
      return null;
   }
   return;
};

export const getLanguageIdFromString = (languageCode) => {
   if (languageCode) {
      let allLanguage = JSON.parse(ALL_LANGUAGE());
      for (const item of allLanguage) {
         if (item?.examLangCode === languageCode) {
            return item?._id;
         }
      }
   } else {
      return null;
   }
   return;
};


export const getLanguageCodefromString = (languageString) => {
   if (languageString) {
      let allLanguage = JSON.parse(ALL_LANGUAGE());
      for (const lang of allLanguage) {
         if (lang?.language === languageString) {
            return lang?.examLangCode
         }
      }
   } else {
      return null;
   }
   return;
}


export const getLanguageStringFromShortCode = (shortCode) => {
   if (shortCode) {
      let allLanguage = JSON.parse(ALL_LANGUAGE());
      for (const item of allLanguage) {
         if (item?.examLangCode === shortCode) {
            return item?.language
         }
      }
   } else {
      return null;
   }
   return;
};


//getStateStringFromStateID

export const getStateStringFromStateID = (stateId) => {
   if (stateId) {
      let allState = JSON.parse(STATES());
      for (const item of allState) {
         if (item?._id === stateId) {
            return item?.states
         }
      }
   } else {
      return null;
   }
   return;
};
export const getStateObjectFromStateID = (stateId) => {
   if (stateId) {
      let allState = JSON.parse(STATES());
      for (const item of allState) {
         if (item?._id === stateId) {
            return item
         }
      }
   } else {
      return null;
   }
};

export const preparationCalenderSecondToHourMinSec = (seconds) => {
    if (seconds < 0) {
        seconds = Math.abs(seconds);
    }
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    const hourString = hours > 0 ? `${hours}h` : ''
    const minuteString = minutes > 0 ? `${minutes}m` : ''
    const secondString =
        remainingSeconds > 0 ? `${remainingSeconds}s` : ''

    if (hours > 0) {
        return `${hourString}:${minuteString || '00m'} ${secondString && `:${secondString}`}`
    } else if (!hours && minutes > 0) {
        return `${minuteString} ${secondString && `:${secondString}`}`
    }

    return secondString
}