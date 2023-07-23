window.isAuthenticated = false;   // variable global que nos dice si se ha podido autenticar o no
window.identity = {};             // diccionario con los datos recuperados, ya descodificados desde el token
window.token = '';                // token recuperado
var url = "https://script.google.com/macros/s/AKfycbw_MLUJXZe99Pk4YqNcfv6Ks1l9aYFBkPLKAbgUlXBOy_ImosqyuLMg5DAROr-wCpw1/exec?";

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
      auto_select: false
  });
  google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" }     //customization attributes (pdte ver en la documentación)
  );
  google.accounts.id.prompt();                //also display the One Tap dialog
}

// si está logado, muestra la info de cabecera, nombre y foto y oculta botón de one-tap
function showAuthInfo() {

  if (window.isAuthenticated) { 

    console.log("AUTHENTICATED IN AFAC");
    console.log("datos:" + window.identity.name + ' ' + window.identity.email + ' ' + window.identity.picture);
    //document.getElementById("login").style.setProperty('display', 'none'); 
    document.getElementById("login").remove();       //borrar elemento del dom

    url = url + "email=" + window.identity.email; 
    console.log("URL:" + url);
    document.getElementById("gas_afac").style.setProperty('src', url); 

    document.getElementById("cuerpo").style.removeProperty('display');
     
  } else {

    console.log("NOT AUTHENTICATED");
    //document.getElementById("login").style.setProperty('display', 'none');
    //document.getElementById("cuerpo").style.setProperty('display', 'none');
    document.getElementById("welcome").innerText = "Si us plau, utilitzeu un compte de google per fer login a l'aplicació";
  }

}
