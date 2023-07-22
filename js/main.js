window.isAuthenticated = false;   // variable global que nos dice si se ha podido autenticar o no
window.identity = {};             // diccionario con los datos recuperados, ya descodificados desde el token
window.token = '';                // token recuperado

// funciones para decodificar el token devuelto por Google
// Source: https://stackoverflow.com/a/47574303/4064162 Answer by user "Rafael Quintela"
// token, You can try to decode it by yourself in a webpage like "https://jwt.io/" or "https://jwt.ms/"
let b64DecodeUnicode = str =>
    decodeURIComponent(
      Array.prototype.map.call(atob(str), c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));

let parseJwt = token =>
    JSON.parse(
    b64DecodeUnicode(
      token.split('.')[1].replace('-', '+').replace('_', '/')
    ));

// función que trata la respuesta con las credenciales devueltas por Google
function handleCredentialResponse(response) {
  window.token = response.credential;
  window.identity = parseJwt(response.credential);
  window.isAuthenticated = true;
  showAuthInfo();
}

//Al cargar la ventana se lanza el proceso de Autenticación
window.onload = function () {
  window.isAuthenticated = false;
  showAuthInfo();
  google.accounts.id.initialize({
      client_id: "1009336245126-7a1g0qdglr9l7svpusr60h77bps9h6pr.apps.googleusercontent.com",
      callback: handleCredentialResponse,
      auto_select: true,
  });
  google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" }     //customization attributes (pdte ver en la documentación)
  );
  google.accounts.id.prompt();                //also display the One Tap dialog
}

//crea tabla con los datos recuperados
function populateTable() {
  var table = document.getElementById("token-table");
  var keys = Object.keys(window.identity);
  var j = 0;
  for (var i = 1; i < keys.length; i++) {
      var row = table.insertRow(i);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      cell1.innerHTML = keys[j];
      cell2.innerHTML = window.identity[keys[j]];
      j++;
  }
}

//borrar la tabla, que ya no la necesitamos
function destroyTable() {
  var table = document.getElementById("token-table");
  var rowCount = table.rows.length;
  for (var i = 1; i < rowCount; i++) {
      table.deleteRow(i);
  }
}

// si está logado, muestra la info de cabecera, nombre y foto y oculta botón de one-tap
function showAuthInfo() {
  if (window.isAuthenticated) { 
    console.log("llega a IS AUTHENTICATED");
    document.getElementById("cuerpo").style.removeProperty('display');
    document.getElementById("authenticated").style.setProperty('display', 'none');
    document.getElementById("welcome").innerHTML = "Hello <b>" + "${window.identity.name}!</b>" + 
                                                   '<img src="${window.identity.picture}" style="padding: 0 2rem 0 2rem; border-radius: 50%;">';
    populateTable();
    console.log("datos:" + window.identity.name + ' ' + window.identity.email);
  } else {
    console.log("PUES LLEGA AQUI, NOT AUTHENTICATED");
    document.getElementById("authenticated").style.setProperty('display', 'none');
    document.getElementById("cuerpo").style.setProperty('display', 'none');
    document.getElementById("welcome").innerText = 'Hello there!';
    destroyTable();
  }
}
