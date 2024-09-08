(function () {
    "use strict";
  
    const items = [
      "😅",
      "😅",
      "😅",
      "😅",
      "🦆",
      "🦆",
      "🦆",
      "🚀",
      "🚀",
      "🤑"
    ];
  
    const doors = document.querySelectorAll(".door");
    document.querySelector("#spinner").addEventListener("click", spin);
    document.querySelector("#resetter").addEventListener("click", init);
    const winOrloseText = document.querySelector("#winOrLose");
  
    async function spin() {
      const bet = parseInt(document.querySelector("#betInput"). value);
      let balance = parseInt(document.querySelector("#balance").textContent);

      if (isNaN(bet) || bet > balance || bet <= 0) {
        winOrloseText.textContent = `Invalid bet.`;
        return;
      }

      init(false, 1, 2);
      for (const door of doors) {
        const boxes = door.querySelector(".boxes");
        const duration = parseInt(boxes.style.transitionDuration);
        boxes.style.transform = "translateY(0)";
        await new Promise((resolve) => setTimeout(resolve, duration * 100));
      }

      const winningSymbol = checkForWin();

      if (winningSymbol) {
        let multiplier = 0;
        switch (winningSymbol) {
          case "😅":
            multiplier = 2;
            break;
          case "🦆":
            multiplier = 4;
            break;
          case "🚀":
            multiplier = 7;
            break;
          case "🤑":
            multiplier = 10;
            break;
        }
        const winnings = bet * multiplier;
        balance += winnings;
        winOrloseText.textContent = `Nice! You won ${winnings}€.`;
      } else {
        balance -= bet;
        winOrloseText.textContent = `No win for you...`;
      }
      document.querySelector("#balance").textContent = balance;
    }
  
    function init(firstInit = true, groups = 1, duration = 1) {
      winOrloseText.textContent = "Gambling addiction is no joke.";
      for (const door of doors) {
        if (firstInit) {
          door.dataset.spinned = "0";
        } else if (door.dataset.spinned === "1") {
          return;
        }
  
        const boxes = door.querySelector(".boxes");
        const boxesClone = boxes.cloneNode(false);
  
        const pool = ["❓"];
        if (!firstInit) {
          const arr = [];
          for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
            arr.push(...items);
          }
          pool.push(...shuffle(arr));
  
          boxesClone.addEventListener(
            "transitionstart",
            function () {
              door.dataset.spinned = "1";
              this.querySelectorAll(".box").forEach((box) => {
                box.style.filter = "blur(2px)";
              });
            },
            { once: true }
          );
  
          boxesClone.addEventListener(
            "transitionend",
            function () {
              this.querySelectorAll(".box").forEach((box, index) => {
                box.style.filter = "blur(0)";
                if (index > 0) this.removeChild(box);
              });
            },
            { once: true }
          );
        }
  
        for (let i = pool.length - 1; i >= 0; i--) {
          const box = document.createElement("div");
          box.classList.add("box");
          box.style.width = door.clientWidth + "px";
          box.style.height = door.clientHeight + "px";
          box.textContent = pool[i];
          boxesClone.appendChild(box);
        }
        boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
        boxesClone.style.transform = `translateY(-${
          door.clientHeight * (pool.length - 1)
        }px)`;
        door.replaceChild(boxesClone, boxes);
      }
    }

    function checkForWin() {
      const symbols = [];

      doors.forEach(door => {
        const box = door.querySelector(".box");
        symbols.push(box.textContent);
      });

      if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
        return symbols[0];
      } else {
        return null;
      }
    }
  
    function shuffle([...arr]) {
      let m = arr.length;
      while (m) {
        const i = Math.floor(Math.random() * m--);
        [arr[m], arr[i]] = [arr[i], arr[m]];
      }
      return arr;
    }
  
    init();
    }
)();
  