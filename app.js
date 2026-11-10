
/* Momo's iPhone - Main Application */

const Phone = {
  currentApp: null,

  open(appName) {
    this.currentApp = appName;

    document.querySelectorAll(".phone-page").forEach(page => {
      page.hidden = true;
    });

    const target = document.getElementById(appName);
    if (target) target.hidden = false;
  },

  home() {
    this.currentApp = null;

    document.querySelectorAll(".phone-page").forEach(page => {
      page.hidden = true;
    });

    document.getElementById("homeScreen").hidden = false;
  }
};

/* KakaoTalk initial data */

const KakaoTalk = {
  friends: [],
  chats: [],
  activeChat: null,

  addFriend(name, status = "Hello ♡") {
    const friend = {
      id: crypto.randomUUID(),
      name,
      status,
      avatar: "👤"
    };

    this.friends.push(friend);
    return friend;
  },

  createChat(friendId) {
    const friend = this.friends.find(item => item.id === friendId);
    if (!friend) return null;

    const chat = {
      id: crypto.randomUUID(),
      name: friend.name,
      messages: []
    };

    this.chats.push(chat);
    return chat;
  },

  sendMessage(chatId, message) {
    const chat = this.chats.find(item => item.id === chatId);
    if (!chat || !message.trim()) return;

    chat.messages.push({
      id: crypto.randomUUID(),
      sender: "Momo",
      text: message.trim(),
      time: new Date().toLocaleTimeString("zh-TW", {
        hour: "2-digit",
        minute: "2-digit"
      })
    });

    StoryStorage.save();
  }
};

/* Save and load story data */

const StoryStorage = {
  save() {
    const data = {
      friends: KakaoTalk.friends,
      chats: KakaoTalk.chats
    };

    localStorage.setItem("momo-phone-data", JSON.stringify(data));
  },

  load() {
    const saved = localStorage.getItem("momo-phone-data");
    if (!saved) return;

    try {
      const data = JSON.parse(saved);
      KakaoTalk.friends = data.friends || [];
      KakaoTalk.chats = data.chats || [];
    } catch (error) {
      console.error("Unable to load saved data", error);
    }
  }
};

StoryStorage.load();

/* iPhone Passcode System */

const Passcode = {
  value: "",
  mode: "unlock",
  firstEntry: "",
  maxLength: 4,

  init() {
    this.value = "";
    this.firstEntry = "";

    const savedCode = localStorage.getItem("momo-phone-passcode");

    this.mode = savedCode ? "unlock" : "setup";
    this.show();
  },

  show() {
    const panel = document.getElementById("passcodeScreen");
    if (!panel) return;

    panel.hidden = false;
    this.updateDisplay();
  },

  hide() {
    const panel = document.getElementById("passcodeScreen");
    if (panel) panel.hidden = true;
  },

  press(number) {
    if (this.value.length >= this.maxLength) return;

    this.value += String(number);
    this.updateDisplay();

    if (this.value.length === this.maxLength) {
      setTimeout(() => this.check(), 180);
    }
  },

  erase() {
    this.value = this.value.slice(0, -1);
    this.updateDisplay();
    this.message("");
  },

  updateDisplay() {
    const dots = document.querySelectorAll(".passcode-dot");

    dots.forEach((dot, index) => {
      dot.classList.toggle("filled", index < this.value.length);
    });
  },

  message(text) {
    const element = document.getElementById("passcodeMessage");
    if (element) element.textContent = text;
  },

  check() {
    if (this.mode === "setup") {
      this.firstEntry = this.value;
      this.value = "";
      this.mode = "confirm";
      document.getElementById("passcodeTitle").textContent = "確認你的密碼";
      this.message("請再次輸入四位數密碼");
      this.updateDisplay();
      return;
    }

    if (this.mode === "confirm") {
      if (this.value === this.firstEntry) {
        localStorage.setItem("momo-phone-passcode", this.value);
        this.mode = "unlock";
        this.value = "";
        this.message("密碼設定完成 ♡");
        this.updateDisplay();

        setTimeout(() => {
          this.hide();
          document.getElementById("lockScreen").hidden = true;
          document.getElementById("homeScreen").hidden = false;
        }, 650);
      } else {
        this.value = "";
        this.firstEntry = "";
        this.mode = "setup";
        document.getElementById("passcodeTitle").textContent = "設定密碼";
        this.message("兩次密碼不一致，請重新設定");
        this.updateDisplay();
      }
      return;
    }

    const savedCode = localStorage.getItem("momo-phone-passcode");

    if (this.value === savedCode) {
      this.value = "";
      this.hide();
      document.getElementById("lockScreen").hidden = true;
      document.getElementById("homeScreen").hidden = false;
    } else {
      this.value = "";
      this.message("密碼錯誤，請再試一次");
      this.updateDisplay();
    }
  }
};

/* Unlock interaction */

function unlockPhone() {
  const savedCode = localStorage.getItem("momo-phone-passcode");

  if (!savedCode) {
    Passcode.mode = "setup";
    document.getElementById("passcodeTitle").textContent = "設定四位數密碼";
  } else {
    Passcode.mode = "unlock";
    document.getElementById("passcodeTitle").textContent = "輸入密碼";
  }

  Passcode.value = "";
  Passcode.message("");
  Passcode.show();
}

/* KakaoTalk tabs */

function showKakaoTab(tab) {
  ["friends", "chats", "profile"].forEach(name => {
    document.getElementById(name + "Tab").hidden = name !== tab;
  });
}

function addDemoFriend() {
  const name = prompt("Enter your friend's name:");
  if (!name || !name.trim()) return;

  const friend = KakaoTalk.addFriend(name.trim());
  StoryStorage.save();

  const list = document.getElementById("friendsTab");
  const item = document.createElement("p");
  item.textContent = "👤 " + friend.name;
  list.appendChild(item);
}

console.log("Momo's iPhone is ready ♡");
