
/* Momo's iPhone - Main Application */

const Phone = {
  currentApp: null,

  open(appName) {
    this.currentApp = appName;

    document.querySelectorAll(".phone-page")
      .forEach(page => page.hidden = true);

    const target = document.getElementById(appName);

    if (target) {
      target.hidden = false;
    }
  },

  home() {
    this.currentApp = null;

    document.querySelectorAll(".phone-page")
      .forEach(page => page.hidden = true);

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
    const friend = this.friends.find(
      item => item.id === friendId
    );

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
    const chat = this.chats.find(
      item => item.id === chatId
    );

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
  }
};

/* Save and load story data */

const StoryStorage = {
  save() {
    const data = {
      friends: KakaoTalk.friends,
      chats: KakaoTalk.chats
    };

    localStorage.setItem(
      "momo-phone-data",
      JSON.stringify(data)
    );
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

console.log("Momo's iPhone is ready ♡");
