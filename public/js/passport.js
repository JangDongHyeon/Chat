function doJoin() {
	var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
	var regNxp= /^[가-힣]{2,4}|[a-zA-Z]{2,10}\s[a-zA-Z]{2,10}$/;



 
		if (frm.email.value == "") {
			alert("Please enter your email.");
			frm.email.focus();
			return ;
		}
		if (!frm.email.value.match(regExp)) {
			alert("Not a valid email format");
			frm.email.focus();
			return ;

		}

		if (frm.password.value == "") {
			alert("Please enter your password.");
			frm.password.focus();
			return ;
		}

		if (frm.nick.value == "") {
			alert("Please enter your Nick.");
			frm.nick.focus();
			return ;
        }
        
		if (!frm.nick.value.match(regNxp)) {
			alert("Not a valid nick format.");
			frm.nick.focus();
			return ;
		}
		 
		 return	frm.submit();
    }
    

	
	function doLogin() {
		if (frm.email.value == "") {
			alert("Please enter your email.");
			frm.email.focus();
			return ;
		}
		if (frm.password.value == "") {
			alert("Please enter your password.");
			frm.password.focus();
			return ;
		}
		 
		 return	frm.submit();
	}
