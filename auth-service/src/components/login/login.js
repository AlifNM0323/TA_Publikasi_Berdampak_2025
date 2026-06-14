onCompleted: (data) => {
  const token = data.login.token;

  const userName = data.login.user.username; 
  
  localStorage.setItem('authToken', token);
  localStorage.setItem('user', userName); 
  
  setToken(token);
  
  Swal.fire({
    icon: 'success',
    title: 'Login Berhasil!',
    text: `Selamat datang kembali, Pak ${userName}.`,
    timer: 1500,
    showConfirmButton: false
  });
}