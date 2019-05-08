function enter() {
  var input = document.getElementById("message_in_1");
    input.addEventListener("keyup", function(event) {
      if(event.keyCode === 13) {
        var console_text = "entered";
        if (input.value !== null && input.value !== "") {
          event.preventDefault();
          document.getElementById("message_send_1").click();
          console_text += " and sent";
        }
        console.log(console_text);
      }
    });
}

function enter_() {
  var input = document.getElementById("message_in_2");
    input.addEventListener("keyup", function(event) {
      if(event.keyCode === 13) {
        var console_text = "entered";
        if (input.value !== null && input.value !== "") {
          event.preventDefault();
          document.getElementById("message_send_2").click();
          console_text += " and sent";
        }
        console.log(console_text);
      }
    });
}

function up() {
   var message_text = document.getElementById("message_in_1").value;
   // console.log(message_text);
   var thread = document.getElementById("thread");
   if(lastOneToTalk(1)) {
     thread.value += "   ";
   } else thread.value += "1: ";
   thread.value += message_text + "\n";
   document.getElementById("message_in_1").value = "";
}

function up_() {
   var message_text = document.getElementById("message_in_2").value;
   // console.log(message_text);
   var thread = document.getElementById("thread");
   if (lastOneToTalk(2)) {
     thread.value += "   ";
   } else thread.value += "2: ";
   thread.value += message_text + "\n";
   document.getElementById("message_in_2").value = "";
}

function lastOneToTalk(id) {
  var thread_arr = document.getElementById("thread").value.split("\n");
  thread_arr.pop();
  // console.log(thread_arr);

  var bool = false, eval = false;
  while(thread_arr.length > 0) {
    let v = thread_arr[thread_arr.length-1];
    // console.log("v:"+v);
    // console.log("v[0]:"+v[0] + " / id:"+ id);
    // console.log("eval:"+eval);
    // console.log("bool:"+bool);
    if((eval == false) && (v[0] !== " ")) {
      if (v[0] === id.toString()) bool = true;
      eval = true;
    }

    thread_arr.pop();
  }

  return bool;
}

function show() { //console only
  var thread_ = document.getElementById("thread").value;
  var thread_arr = thread_.split("\n");
  thread_arr.pop();
  for(var message of thread_arr) {
    console.log(message);
  }
}