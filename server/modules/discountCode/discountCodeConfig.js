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
    remarkLength: {
      english: "Length of bio should be between 5 to 500",
      amharic: "የራስ መገለጫ ዝርዝር ክ5 ማነስ እና ክ500 መብለጥ የለበትም ",
      oromifa: "Dheerinni yaada 5 hanga 50 gidduu ta’u qaba",
    },
    invalidNumber: {
      english: "Please enter a valid number",
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
    codeUsed: {
      english: "Promo code has already been used",
      amharic: "የቅናሽ መለያ ቁጥሩ ያገለገለ ነው",
      oromifa: "Koodiin durati fayyadeera",
    },
    invalidDelete: {
      english: "Code has been used, cannot be deleted",
      amharic: "መለያው አገልግሎት ላይ ሰለሆነ ማጥፋት አይቻልም ",
      oromifa: "Koodiin fayyadeera, haqamuu hin danda’u",
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
