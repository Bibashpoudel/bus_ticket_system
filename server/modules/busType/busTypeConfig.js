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
    invalidPosition: {
      english: "Position can either be LEFT or RIGHT",
      amharic: "አቅጣጫ ግራ ወይንም ቀኝ መሆን አለበት",
      oromifa: "Kallattiin mirgaa ykn bitaa ta’u qaba",
    },
    busTypeExists: {
      english: "Bus type exists in a bus, can not be deleted",
      amharic: "ባስ ዝርዝር ውስጥ ስለሚገኝ ማጥፋት አይችሉም",
      oromifa: "Gosa otoobsii balleessuun hin dana’amuu",
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
  delete: {
    english: "Data deleted successfully",
    amharic: "መረጃው በሚገባ ተሰርዟል",
    oromifa: "Haquumsi daataa milkaa’era",
  },
};
