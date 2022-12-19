module.exports = {
  validate: {
    empty: {
      english: "This field is required",
      amharic: "የግዴታ አስፈላጊ",
      oromifa: "Dirreen kun dirqama’aa guutamuu qaba",
    },
    isEmail: {
      english: "Invalid Email",
      amharic: "የተሳሳተ የኢሜል አድራሻ",
      oromifa: "I-maayiil dogoggora",
    },
    invalid: {
      english: "Invalid entry",
      amharic: "የተሳሳተ ግብዓት",
      oromifa: "Galfata dogoggora",
    },
    isMongoId: {
      english: "This is not mongo id",
      amharic: "ይህ የነገሮች መለያ አይደለም",
      oromifa: "Eenymmeessaa mongo miti",
    },
    isDate: {
      english: "This field must conatain Date",
      amharic: "ቀን ይሙሉ",
      oromifa: "Dirrreen kun maqa qabachuu qaba",
    },
    duplicateData: {
      english: "Data already exists",
      amharic: "ከዚህ ቀደም ያለ ዳታ",
      oromifa: "Daataa",
    },
    invalidInput: {
      english: "Invalid input",
      amharic: "የተሳሳተ ግብዓት",
      oromifa: "Galcha dogoggora",
    },
    invalidPosition: {
      english: "Invalid seat position",
      amharic: "አቅጣጫ ግራ ወይንም ቀኝ መሆን አለበት",
      oromifa: "Kallattiin mirgaa ykn bitaa ta’u qaba",
    },
    descriptionLength: {
      english: "length of description should be between 1 to 500 charaters",
      amharic: "የማብራሪያ ፊደላት ብዛት በ1 እና በ500 መሃል መሆን አለበት",
      oromifa: "Dheerina ibsa arfii 1 hanga 500 gidduu ta’u qaba",
    },
    remarkLength: {
      english: "length of bio should be between 5 to 500",
      amharic: "የራስ መገለጫ ዝርዝር ክ5 ማነስ እና ክ500 መብለጥ የለበትም ",
      oromifa: "Dheerinni yaada 5 hanga 50 gidduu ta’u qaba",
    },
    invalidNumber: {
      english: "Enter a valid amount",
      amharic: "ትክክለኛ ቁጥር ያስገቡ",
      oromifa: "Maaloo lakkobsa sirrii galchaa.",
    },
    codeLenth: {
      english: "This field must be 4-8 characters long",
      amharic: "ይህ ቦታ ከ4 እስከ 8 ፊደላት/ቁጥሮች/ምልክቶችን ብቻ ይይዛል ",
      oromifa: "Dirreen kun dheerina arfii 4-8 ta’u qaba",
    },
    emptyAmount: {
      english: "Amount and Percent both can not be empty",
      amharic: "መጠን እና ፐርሰንት ሁለቱም ባዶ መሆን አይችሉም",
      oromifa: "Hangaa fi dhibbeentaan duwwaa ta’u hin danda’an",
    },
    invalidCode: {
      english: "Discount code entered is invalid",
      amharic: "ያስገቡት የቅናሽ መለያ የተሳሳተ ነው",
      oromifa: "Koodiin hir’isuuf gale dogoggora",
    },
    isBefore: {
      english: "Date can not be before today",
      amharic: "የቀን ምርጫዎ ከዛሬ በኋላ መሆን አለበት",
      oromifa: "Guyyaan har’an dura tahu hin qabu",
    },
    DATE_FORMAT: "yyyy-MM-dd",
    unavailable: {
      english: "Seat unavailable",
      amharic: "የመረጡት መቀመጫ ተይዟል",
      oromifa: "Teessumi hin jiru",
    },
    reserved: {
      english: "Seat has been reserved",
      amharic: "የመረጡት መቀመጫ ተመርጧሎታል",
      oromifa: "teessumni qabamera",
    },
    booked: {
      english: "Seat has been booked",
      amharic: "የመረጡት መቀመጫ ተይዟሎታል",
      oromifa: "Teessumni qabamera",
    },
  },
  get: {
    english: "Data obtaied successfully",
    amharic: "መረጃው በሚገባ ተገኝቷል",
    oromifa: "Daataan milkaa’inaan argameera",
  },
  post: {
    english: "Data stored successfully",
    amharic: "መረጃው በሚገባ ተቀምጧል",
    oromifa: "Daataan milkaa’inaan kusamera",
  },
  put: {
    english: "Data updated successfully",
    amharic: "መረጃው በሚገባ ታድሷል",
    oromifa: "Haaromsi Daataan milkaa’eera",
  },
  unSelect: {
    english: "Seat has been unselected",
    amharic: "የመረጡትን መቀመጫ ሰርዘዋል",
    oromifa: "Tesumma qabatan haqtaniitu",
  },

  delete: {
    english: "Data deleted successfully",
    amharic: "መረጃው በሚገባ ተሰርዟል",
    oromifa: "Haquumsi daataa milkaa’era",
  },
  deleteFailed: {
    english: "Booking cancelling time has expired",
    amharic: "ጉዞ ለመሰረዝ የነበርዎት ጊዜ አልቋል",
    oromifa: "Adeemsa booking kufiisuuf yeroo isaa darbera",
  },
  cancelled: {
    english: "The ticket you booked has been cancelled",
    amharic: "ያስያዙት ትኬት ተሰርዟል ",
    oromifa: "Tikeetiin qabatan haqameera",
  },
  cancelledFail: {
    english: "It is not possible to cancel a ticket booked for today",
    amharic: "ለዛሬ የተቆረጠን ትኬት መሰረዝ አይቻልም ",
    oromifa: "Tikeetii har’af qabame haquun hin danda’amu",
  },
};
