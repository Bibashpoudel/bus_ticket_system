module.exports = {
  validate: {
    empty: {
      english: "This field is required",
      amharic: "የግዴታ አስፈላጊ",
      oromifa: "Dirreen kun dirqama’aa guutamuu qaba",
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

    descriptionLength: {
      english: "Length of description should be between 1 to 500 charaters",
      amharic: "የማብራሪያ ፊደላት ብዛት በ1 እና በ500 መሃል መሆን አለበት",
      oromifa: "Dheerina ibsa arfii 1 hanga 500 gidduu ta’u qaba",
    },

    invalidPayment_type: {
      english:
        "Payment type should be one of telebirr, wallet, card, cash, cash-deposit, bank-transfer",
      amharic:
        "ክፍያ ከሚከተሉት በአንዱ መሆን አለበት፤ ቴሌ ብር፣ ዋሌት፣ ካርድ፣ በጥሬ ገንዘብ፣ ጥሬ ገንዘብ በባንክ፣ ከአካውንት ወደ አካውንት",
      oromifa:
        "Kaffaltiin kan ta’u danda’u tele birriin,wayileetn,kaardiin,mallaqa harkaan,fi kara baankii dabaarsuu",
    },
    invalidPaymentGateway: {
      english: "Payment gateway should be one of paypal, telebirr, mpesa",
      amharic: "ክፍያ ማስፈፅሚያ ከሚከተሉት በአንዱ መሆን አለበት፤ ፔይፓል፣ ቴሌ ብር፣ ኤምፔሳ",
      oromifa:
        "Karaan kaffaltii itti goodhamu paypal,tele birria akkasumas mpse ti",
    },
    invalidNumber: {
      english: "Please enter a valid number",
      amharic: "ትክክለኛ ቁጥር ያስገቡ",
      oromifa: "Maaloo lakkobsa sirrii galchaa.",
    },
    invalidTicket: {
      english: "Your ticket has been expired",
      amharic: "ትኬቶ ጊዜው አልፎበታል",
      oromifa: "Yeroon tikeetii irra darbeera",
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
  bookingIdInvalid: {
    english: "An unknown problem has occurred",
    amharic: "ያልታወቀ ችግር ተፈጥሯል",
    oromifa: "Raakkoon hin beekamne uumameerra",
  },
  ticketExist: {
    english: "Seat already reserved",
    amharic: "መቀመጫ አስቀድሞ ተይዟል",
    oromifa: "Iddoon dursee qabamadha",
  },
  errorBookingData: {
    english: "Something went wrong, Try again!",
    amharic: "የሆነ ችግር ተፈጥሯል፣ እንደገና ይሞክሩ!",
    oromifa: "Rakkoon umameera, irraa debi'un yaala!",
  },

  paymentMethodPost: {
    english: "Payment method has been added successfully",
    amharic: "የክፍያ መንገዱ በተሳካ ሁኔታ ታክሏል",
    oromifa: "Adeemsi kaffaltii haala gariin ida’ameera",
  },

  paymentMethodUpdate: {
    english: "Payment method updated successfully",
    amharic: "የክፍያ መንገዱ በተሳካ ሁኔታ ታድሷል",
    oromifa: "Tooftan kaffaltii haala gariin haroomsameera",
  },

  failedPayment: {
    english: "Payment failed please try again",
    amharic: "የክፍያ ሂደቱ ተቋርጧል እባክዎን እንደገና ይሞክሩ",
    oromifa: "Kaffaltiin kufeera maaloo irraa debi’uun yaala",
  },
};
