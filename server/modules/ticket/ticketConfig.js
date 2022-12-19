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
    DATE_FORMAT: "yyy-MM-dd",
    invalidId: {
      english: "Invalid ticked id",
      amharic: "የተሳሳተ የትኬት ቁጥር",
      oromifa: "Eenyummeessaa dogogora tuqame",
    },
    notVerified: {
      english: "Ticket not verified",
      amharic: "ተኬቶ አልተረጋገጠም",
      oromifa: "Tikeetiin mirkaanahu hin danda’u",
    },

    canceled: {
      english: "Canceled ticket cannot be validated",
      amharic: "ትኬቱ ስለተሰረዘ ማረጋገጥ አይቻልም",
      oromifa: "Haqoomsa tiketii gateessuu hin danda’amu",
    },
    notConfirm: {
      english: "Ticket status is in Pending, cannot be validated",
      amharic: "የቲኬት ሁኔታ በመጠባበቅ ላይ ነው፣ ሊረጋገጥ አልቻለም",
      oromifa: "Haali tikeetii adeemsa irraa jira,mirkaanessuu hin danda’u",
    },
    validated: {
      english: "Ticket has been validated already",
      amharic: "ትኬቱ ከዚህ ቀደም ተመሳክሯል ",
      oromifa: "Tikeetiin mirkanaa’eerra",
    },
    notAllocated: {
      english: "Validator is not assigned the given bus",
      amharic: "ለዚህ ባስ ማረጋገጫ አልተመደበለትም",
      oromifa: "Otoobsiin hi ramadamne",
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
  update: {
    english: "Data has been updated successfully",
    amharic: "መረጃው በሚገባ ታድሷል",
    oromifa: "Daataan milkaa’inan haraa’era",
  },
};
