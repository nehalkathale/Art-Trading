function getImage(uploaded) {
    if (uploaded.files && uploaded.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("newTradeImage").src = e.target.result;
      };
      reader.readAsDataURL(uploaded.files[0]);
    }
  }