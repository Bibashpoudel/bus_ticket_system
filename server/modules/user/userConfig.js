module.exports = {
  validate: {
    duplicateEmail: {
      english: "The email already exists",
      amharic: "ኢሜይሉ ከዚህ በፊት ያለ ነው",
      oromifa: "I-maayiiln dursee jira",
    },
    emailNotFound: {
      english: "Email not exists",
      amharic: "ኢሜይሉ ከዚህ በፊት ያለ ነው",
      oromifa: "I-maayiiln dursee jira",
    },

    duplicateUser: {
      english: "The User already exists",
      amharic: "ተጠቃሚው አስቀድሞ አለ",
      oromifa: "Fayyadaman dursee jira",
    },
    empty: {
      english: "This field is required",
      amharic: "የግዴታ አስፈላጊ",
      oromifa: "Dirreen kun dirqama’aa guutamuu qaba",
    },
    invalid: {
      english: "Invalid entry",
      amharic: "የተሳሳተ ግብዓት",
      oromifa: "Galfata dogoggora",
    },
    invalidPhone: {
      english: "Invalid phone number",
      amharic: "የተሳሳተ ስልክ ቁጥር",
      oromifa: "Lakk.bilbila fashala",
    },
    isEmail: {
      english: "Invalid Email",
      amharic: "የተሳሳተ የኢሜል አድራሻ",
      oromifa: "I-maayiil dogoggora",
    },
    isMongoId: {
      english: "This is not mongo id",
      amharic: "ይህ የነገሮች መለያ አይደለም",
      oromifa: "Eenymmeessaa mongo miti",
    },
    isEightChar: {
      english: "The password must be at least 8 character",
      amharic: "የይለፍ ቃል ቢያንስ 8 መሆን አለበት",
      oromifa: "Iggitiin yoo xiqqate arfii saddeet tahu qaba",
    },
    nameLength: {
      english: "This field should be between 2 to 50",
      amharic: "እዚህ ቦታ ላይ የሚሞላው ከ2 ማነስ እና ከ50 መብለጥ የለበትም",
      oromifa: "Dirreen kun 2 hanga 50 gidduu tahu qaba",
    },
    usernameLength: {
      english: "This field should be between 4 to 15 characters",
      amharic: "እዚህ ቦታ ላይ የሚሞሉት ፊደላት/ቁጥሮች/ምልክቶች ከ2 ማነስ እና ከ50 መብለጥ የለበትም",
      oromifa: "Dirreen kun 4 hanga 50 gidduu tahu qaba",
    },
    isDate: {
      english: "This field must conatain Date",
      amharic: "ቀን ይሙሉ",
      oromifa: "Dirrreen kun maqa qabachuu qaba",
    },
    passLength: {
      english: "Password must be atleast 6 characters, max limit 30 characters",
      amharic: "የማለፊያ ቃል  ከ6 ማነስ ከ30 መብለጥ የለበትም",
      oromifa: "Iggiitin inni xiqqaan afii 6, inni guddaan arfii 30 tahu qaba",
    },
    remarkLength: {
      english: "Length of bio should be between 5 to 500",
      amharic: "የራስ መገለጫ ዝርዝር ክ5 ማነስ እና ክ500 መብለጥ የለበትም ",
      oromifa: "Dheerinni yaada 5 hanga 50 gidduu tahu qaba",
    },
    skillLength: {
      english: "Length of skill should be between 5 to 400",
      amharic: "የክህሎት መግለጫ ከ5 ማነስ እና ከ400 መብለጥ የለበትም",
      oromifa: "Dheerinni dandeettii 5 hanga 50 gidduu tahu qaba",
    },
    emailLength: {
      english: "Length of email should be between 5 to 100",
      amharic: "ኢሜይል ከ5 ማነስ እና ከ100 መብለጥ የለበትም",
      oromifa: "Dheeriini i-maayiili 5 hanga 50 gidduu tahu qaba",
    },
    pwLength: {
      english: "Length of password should be at least 8 characters",
      amharic: "ማለፊያ ቃል ከ8 ፊደላት/ቁጥሮች/ምልክቶች ማነስ የለበትም",
      oromifa: "Dheeriini iggiita yoo xiqqaate arfii 8 tahu qaba",
    },
    alphaNumeric: {
      english: "This field must be Alpha Numeric",
      amharic: "ይህ ቦታ ፊደላት እና ቁጥሮችን ያካተተ መሆን አለበት",
      oromifa: "Dirreen kun arfii lakkofsa tahu qaba",
    },
    invalid_chars: {
      english: "This field must not contain, + and - characters.",
      amharic: "ይህ ቦታ + እና - ምልክቶችን ማካተት አይችልም",
      oromifa: "Dirren kun + fi – qabachuu hin qabu.",
    },
    limit4to10: {
      english: "This field must be 4-10 characters long",
      amharic: "ይህ ቦታ ከ4 እስከ 10 ፊደላት/ቁጥሮች/ምልክቶች ብቻ ይይዛል",
      oromifa: "Dirreen kun dheerina arfii 4-10 tahu qaba",
    },
    isEqual: {
      english: "Password doesnnot match",
      amharic: "የማይመሳሰል የማለፊያ ቃል",
      oromifa: "Iggiitin wal qixa miti",
    },
    isGender: {
      english: "Provide valid gender",
      amharic: "ትክክለኛ ፆታ ያስገቡ",
      oromifa: "Saala sirrii dhiyeessaa",
    },
    noGender: {
      english: "Please select your gender",
      amharic: "ፆታዎን ይምረጡ",
      oromifa: "Maaloo saala keessan filadha",
    },
    invalidNumber: {
      english: "Please enter a valid number",
      amharic: "ትክክለኛ ቁጥር ያስገቡ",
      oromifa: "Maaloo lakkobsa sirrii galchaa.",
    },
    pinLength: {
      english: "This field should be 6 digit",
      amharic: "ይህ ቦታ 6 ፊደላት/ቁጥሮች/ምልክቶችን ይይዛል ",
      oromifa: "Dirreen kun diigitii 6 ta’u qaba",
    },
    codeLenth: {
      english: "This field must be 4-8 characters long",
      amharic: "ይህ ቦታ ከ4 እስከ 8 ፊደላት/ቁጥሮች/ምልክቶችን ብቻ ይይዛል ",
      oromifa: "Dirreen kun dheerina arfii 4-8 ta’u qaba",
    },
    duplicateData: {
      english: "Data already exists",
      amharic: "ከዚህ ቀደም ያለ ዳታ",
      oromifa: "Daataa",
    },
    invalidRole: {
      english: "Enter valid role",
      amharic: "ተገቢዉን የስራ ድርሻ ያስገቡ",
      oromifa: "Gahee sirrii galchaa",
    },
    unverifiedCaptcha: {
      english: "Captcha unverified",
      amharic: "ያልተረጋገጠ ምንነት",
      oromifa: "Captcha dogoggora",
    },
    unverifiedOtp: {
      english: "OTP unverified",
      amharic: "ያልተረጋገጠ የአንድ ግዜ ማለፊያ ቃል",
      oromifa: "OTP unverified",
    },
    unverifiedAccount: {
      english: "Account deactivated",
      amharic: "የተቋረጠ የአገልግሎት መለያ",
      oromifa: "Herrega hojiira hin oole",
    },
    unverifiedOtpCaptcha: {
      english: "OTP and Captcha unverified",
      amharic: " የአንድ ግዜ ማለፊያ ቃል እና ምንነት አልተረጋገጠም",
      oromifa: "Foohiinsa fi Captcha dogoggora",
    },
  },
  passwordmatched: {
    english: "Password Matched",
    amharic: "የማለፊያ ቃል ተመሳስሏል",
    oromifa: "Iggita wal simaa",
  },
  invalidPassword: {
    english: "Password did not match",
    amharic: "የማለፊያ ቃል አልተመሳሰለም",
    oromifa: "Iggitiin waal hin simnee",
  },
  signUp: {
    english: "Sign Up successfully",
    amharic: "ምዝገባዎ በሚገባ ተጠናቋል",
    oromifa: "Galmeen milkaa’era",
  },
  loginSuccess: {
    english: "Logged in successfully",
    amharic: "በሚገባ ወደ አገልግሎቱ ገብተዋል",
    oromifa: "Seeniins milkaa’era",
  },
  update: {
    english: "Data updated successfully",
    amharic: "መረጃው ታድሷል",
    oromifa: "Haaromsi milkaa’era",
  },
  invalid: {
    english: "Profile not found",
    amharic: "መረጃዎ አልተገኘም",
    oromifa: "Danaan kun hin jiru",
  },
  invalidOtp: {
    english: "Enter valid otp",
    amharic: "ትክክለኛ የአንድ ግዜ ማለፊያ ቃል ያስገቡ",
    oromifa: "Otp sirrii galchaa",
  },
  deleteUser: {
    english: "User removed successfully",
    amharic: "ተገልጋዩ በተሳካ ሁኔታ ተወግዷል",
    oromifa: "Fayyadaman milkaa’inan haqameera",
  },
  get: {
    english: "Data obtaied successfully",
    amharic: "መረጃው በሚገባ ተገኝቷል",
    oromifa: "Daataan milkaa’inaan argameera",
  },
  registerUser: {
    english: "User added successfully",
    amharic: "መረጃው በሚገባ ተቀምጧል",
    oromifa: "Daataan milkaa’inaan kusamera",
  },
  registerCompany: {
    english: "Bus Company added successfully",
    amharic: "መረጃው በሚገባ ተቀምጧል",
    oromifa: "Daataan milkaa’inaan kusamera",
  },
  post: {
    english: "Data stored successfully",
    amharic: "መረጃው በሚገባ ተቀምጧል",
    oromifa: "Daataan milkaa’inaan kusamera",
  },

  success: {
    english: "Success",
    amharic: "ተሳክቷል",
    oromifa: "Milkaa’ina",
  },
  logout: {
    english: "Logout successfully",
    amharic: "በተሳካ ሁኔታ ወጥተዋል",
    oromifa: "Mirkaa’innan baheera",
  },
};
