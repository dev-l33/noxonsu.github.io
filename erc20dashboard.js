	if (typeof urlApi == "undefined") {
		var erc20contract_address = "0x030D1a87a36C9442E25416c3D36611Af5c29Eba9";
		var erc20contract_function_address = "0xe2eB8871aeCaB528E3A36BF8a9b2D9A044b39626";
		var token_owner_address = "0x030D1a87a36C9442E25416c3D36611Af5c29Eba9"
		var option_etherscan_api = 'https://api.etherscan.io'; //change to https://api.etherscan.io for mainnet
		var option_etherscan_api_key = 'QSUZ77YJZ2H68K6SJKRZSAP7ERYJS51893';
		var option_registration_enabled = true;
		var option_registration_backend = 'https://intel.worldbit.com/kyc_interface.php'; ///'subscribe.php'; //you can use remote address like https://yoursite.com/subscribe.php
		var option_recive_btc = ''; //reserved for future
		var initial_supply = 52500000;

		var urlApi = 'https://wallet.worldbit.com/api/v1';
	}

	var ks = localStorage.getItem('keystore');
	if (ks) {
		ks = lightwallet.keystore.deserialize(ks);
	}

	var _balance;
	var gasPrice = "0xcce416600";

	var web3 = new Web3();

	function try2buy(amounteth) {
		if (_balance < parseFloat(amounteth) + parseFloat(0.00005)) {
			$("#consolebuy").html("You need " + amounteth + "+0.02 ETH on balance for this operation");
		} else {
			swal({
				title: 'Are you sure?',
				text: 'You want buy TOKENS for ' + amounteth + ' ETH?',
				type: 'question',
				showCancelButton: true,
				confirmButtonColor: '#44aaff',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, Buy it!'
			}).then((result) => {
				if (result.value) {
					$("#consolebuy").html('.:...::');
					sendRwTr(amounteth, "", "", "#consolebuy");
				}
			});
			// if (confirm('You want buy TOKENS for ' + amounteth + ' ETH?')) {
			// 	$("#consolebuy").html('.:...::');
			// 	sendRwTr(amounteth, "", "", "#consolebuy");
			// }
		}
	}

	function try2sell() {
		$("#consolesell").html('.:...::');
		if ($("#skoko").val() < 1) {
			alert("You have " + $("#skoko").val() + " tokens");
		} else {

			if (tosell = prompt('How many NXP you want to sell?', $("#skoko").val())) {
				sendRwTr(0, [tosell], "sell", "#consolesell");
			}
		}
	}

	function try2send() {
		$("#consolesend").html('.:...::');
		toAddress = $("#kuda").val();
		tokenAmount = $("#skoko").val();
		if (isNaN(tokenAmount)) {
			swal({
				title: 'Error!',
				text: 'Token Amount must be number.',
				type: 'error',
				confirmButtonText: 'OK'
			  });
			return;
		}
		if (!Web3.utils.isAddress(toAddress)) {
			swal({
				title: 'Error!',
				text: 'Invalid Address. Please check address to send Tokens.',
				type: 'error',
				confirmButtonText: 'OK'
			  });
			return;
		}
		sendToken(toAddress, tokenAmount, "#consolesend");
	}

	function try2withdrawETH() {
		var toamount = _balance - 0.019;
		if (toAddress = prompt('Enter ETH address (0x...)')) {
			$("#consolewithdraw").html('.:...::');
			send(toAddress, toamount, "#consolewithdraw");
		}
	}

	function sendToken(toAddress, value, consoleLabel) {
		swal({
			title: 'Enter your password',
			input: 'password',
			inputPlaceholder: 'Enter your password',
			inputAttributes: {
				'maxlength': 10,
				'autocapitalize': 'off',
				'autocorrect': 'off'
			}
		}).then((result) => {
			let password = result.value;
			if (password || password === '') {

				ks.keyFromPassword(password, function (err, pwDerivedKey) {
					if (err) {
						swal(
							'Oops...',
							String(err),
							'error'
						);
						return;
					}
					var params = {
						"fromAddress": openkey,
						"privateKey": g("prv_key"),
						"toAddress" : toAddress,
						"value" : value
					};

					$.ajax({
						method: "POST",
						url: urlApi + "/transaction/transferToken",
						dataType: 'json',
						data: params,
						success: function (d) {
							console.log(JSON.stringify(d));
							$(consoleLabel).html("<a target=_blank href='https://explorer.webchain.network/tx/" + d.transactionHash + "'>" + d.transactionHash + "</a>");

							if (typeof d.transactionHash != "undefined") {
								if (d.message.match(/Insufficient fund/)) d.error.message = 'Error: you must have a small amount of ETH in your account in order to cover the cost of gas. Add 0.06 ETH to this account and try again.';
								$(consoleLabel).html(d.message);
								swal(
									'Oops...',
									'Insufficient funds. The account you tried to send transaction from does not have enough funds.',
									'error'
								);
							} else {
								// reportAffiliate($("#amount").val(), value);
							}
						},
						fail: function (d) {
							swal(
								'Oops...',
								'Network Error, Please try again.',
								'error'
							);
						}
					}, "json");

				});
			} else {
				swal(
					'Oops...',
					'Please enter password',
					'error'
				);
			}
		});
	}


	function send(toAddress, value, consoleLabel) {
		swal({
			title: 'Enter your password',
			input: 'password',
			inputPlaceholder: 'Enter your password',
			inputAttributes: {
				'maxlength': 10,
				'autocapitalize': 'off',
				'autocorrect': 'off'
			}
		}).then((result) => {
			let password = result.value;
			if (password || password === '') {

				ks.keyFromPassword(password, function (err, pwDerivedKey) {
					if (err) {
						swal(
							'Oops...',
							String(err),
							'error'
						);
						return;
					}
					var params = {
						"fromAddress": openkey,
						"privateKey": g("prv_key"),
						"toAddress" : toAddress,
						"value" : value
					};

					$.ajax({
						method: "POST",
						url: urlApi + "/transaction/transfer",
						dataType: 'json',
						data: params,
						success: function (d) {
							console.log(JSON.stringify(d));
							$(consoleLabel).html("<a target=_blank href='https://explorer.webchain.network/tx/" + d.transactionHash + "'>" + d.transactionHash + "</a>");

							if (typeof d.transactionHash != "undefined") {
								if (d.message.match(/Insufficient fund/)) d.error.message = 'Error: you must have a small amount of ETH in your account in order to cover the cost of gas. Add 0.06 ETH to this account and try again.';
								$(consoleLabel).html(d.message);
								swal(
									'Oops...',
									'Insufficient funds. The account you tried to send transaction from does not have enough funds.',
									'error'
								);
							} else {
								// reportAffiliate($("#amount").val(), value);
							}
						},
						fail: function (d) {
							swal(
								'Oops...',
								'Network Error, Please try again.',
								'error'
							);
						}
					}, "json");

				});
			} else {
				swal(
					'Oops...',
					'Please enter password',
					'error'
				);
			}
		});
	}

	openkey = localStorage.getItem("openkey");
	$("#openkey").val(openkey);
	$("#openkeyspan").html(openkey);
	$("#privkey").html(localStorage.getItem("privkey"));
	privkey = localStorage.getItem("privkey");

	$("#savethis").val("Warning! Withdraw all amounts of NXP to your own ethereum wallet! Save this information to your local device! \r\nopenkey:" + openkey + "\r\nprivkey:" + privkey);

	function rebalance() {

		if (typeof extrahook === "function") {
			//extrahook();
		}

		if (!openkey) openkey = "0x";

		// if (localStorage.getItem("name")) {
		// 	$(".hiname").html("Hi " + localStorage.getItem("name") + "!");
		// } else {
		$(".hiname").html("Wallet Contents");
		// }

		if (openkey != "0x") {
			$.ajax({
				type: "GET",
				url: urlApi + "/account/balance/" + openkey,
				dataType: 'json',
	
				success: function (d) {
					console.log(d);
					_balance = d.web;
					$("#balance_eth").html(parseFloat(_balance).toFixed(2) + " WEB");
	
					if (_balance > 0.01) {
						$("#withall").show();
					}
	
					$(".balacnetokensnocss").html(d.token);
						$("#sk").val(d.token);
						if (!$("#skoko").val()) {
							$("#skoko").val(d.token);
						}
	
						$("#balance_tokens").html(parseFloat(d.token).toFixed(2) + " WBT");
	
						if (parseFloat(d.token) > 0.0) {
							$(".onlyhavetoken").show();
							$(".onlynohavetoken").hide();
						}
	
				}
			});
		}

		rebuild_buttons();

		if ($("#openkey").val() == '0x') $("#openkey").val(openkey);
	}




	function recalc() {
		if (typeof tokens_for_one_eth != "number") return false;
		teth = Math.ceil($("#amount").val() / tokens_for_one_eth * 10000000) / 10000000;
		$("#ethfor100hmq").html(teth);


		if (parseFloat($("#price_btc").html()) > 0) {
			$("#btcfor100hmq").html(teth * parseFloat($("#price_btc").html()));
		}
		if (parseFloat($("#price_usd").html()) > 0) {
			$("#usdfor100hmq").html(teth * parseFloat($("#price_usd").html()));
		}

		validateBuyConsole();

		rebuild_buttons();
	}

	function validateBuyConsole() {
		if (_balance > parseFloat($("#ethfor100hmq").html())) {
			$("#consolebuy").html("Buy " + $("#amount").val() + " for " + $("#ethfor100hmq").html());
		} else {
			$("#consolebuy").html("Topup your balance!");
		}
	}


	function rebuild_buttons() {
		if (_balance > parseFloat($("#ethfor100hmq").html())) {
			$("#try2buybtn").removeAttr("disabled", true);

		} else {
			$("#try2buybtn").attr("disabled", true);

		}
		// $(".mailto").prop("href", "mailto:?subject=Private key for " + window.location + "&body=" + exportKeystore());
	}

	function exportKeystore() {
		const encryptedKeystore = web3.eth.accounts.encrypt(g('prv_key'), g('password'));
		return JSON.stringify(encryptedKeystore);
	}

	$(function () {
		$("#slider-range-max").slider({
			range: "max",
			min: 1,
			max: 250000,
			value: 10,
			step: 1,
			slide: function (event, ui) {
				$("#amount").val(ui.value);
				recalc();
				validateBuyConsole();
			},
			change: function (event, ui) {
				recalc();
				validateBuyConsole();
			}
		});

		$("#amount").val($("#slider-range-max").slider("value"));

		recalc();
		build_masonry();
	});


	function build_masonry() {
		var $grid = jQuery('#info2').masonry({
			itemSelector: '.griditem',

			columnWidth: '.col-md-4'
		});

		$grid.masonry();
	}

	function g(n) {
		return localStorage.getItem(n);
	}

	function s(n, v) {
		localStorage.setItem(n, v);
	}

	function generate_ethereum_keys() {

	}

	function build_state() {


		if (g("registered") == 1) {
			$("#name").hide();
			$("#email").hide();
			$("#pass").hide();
			$("#pre_pass").hide();
			$("#reg").hide();
			$("#info2").show();
			$(".mainboard").show();
			$("#btcaddress").val(g("btc"));
			build_masonry();
		} else {
			$("#right").show();

			// if (!g('intro_showed')) {
			// 	swal({
			// 		title: 'WorldBit ICO Wallet',
			// 		html:
			// 		`<br><p class="alert-danger--outline">
			// 			<span>Please take some time to understand this for your own safety. 🙏</span>
			// 			<span>Your funds will be stolen if you do not heed these warnings.</span>
			// 		</p>
			// 		<p class="alert-danger--outline">We cannot recover your funds or freeze your account if you visit a phishing site or lose your private key.</p>
			// 		<br>
			// 		<h3>What is MEW?</h3>
			// 		<ul>
			// 			<li>MyEtherWallet is a free, open-source, client-side interface.</li>
			// 			<li>We allow you to interact directly with the blockchain while remaining in full control of your keys &amp; your funds.</li>
			// 			<li><strong>You</strong> and <strong>only you</strong> are responsible for your security.</li>
			// 		</ul>`,
			// 		showCloseButton: true,
			// 		focusConfirm: false,
			// 		confirmButtonText:
			// 		'<i class="fa fa-thumbs-up"></i> Got It!',
			// 		confirmButtonAriaLabel: 'Thumbs up, Got It!'
			// 	});
			// 	s('intro_showed', true);
			// }

			recalc();
		}

		if (g("name")) {
			if (option_registration_backend == "" && g("registered") != 1) {
				s("registered", 1);

				var secretSeed = lightwallet.keystore.generateRandomSeed();

				eth_keys_gen($("#pass").val(), secretSeed);

				build_state();
				build_masonry();
			}

			$("div.email").show();
			$("#email").focus();
			if (g("email")) {
				$("div.pre_pass").show();
				$("#pre_pass").focus();
				$("#pre_pass").val(g("pre_pass"));

				if (g("pre_pass")) {
					$("div.pass").show();
					$("#pass").focus();
				} else {
					$("div.pass").hide();
				}
			} else {
				$("div.pre_pass").hide();
				$("div.pass").hide();
			}
		} else {
			$("div.email").hide();
		}

		if (localStorage.getItem("saved") == 1) {
			$("#savekey").hide();
			$("#desc_main").show();
			localStorage.removeItem("savekey");
		} else {

			$("#balancediv,#exprta,.mainboard").hide();
			$("#d12keys").html(g("d12keys"));
			if (g("registered") == 1) $("#savekey").show();
		}

		build_masonry();

	}

	function eth_keys_gen(password, secretSeed = '') {
		$("input").css("opacity", "0.4");

		swal({
			title: 'Please wait...',
			text: 'Creating wallet...',
			timer: 20000,
			type: 'info',
			allowOutsideClick: false,
			allowEscapeKey: false,
			onOpen: () => {
				swal.showLoading()
			}
		}).then((result) => {
			if (result.dismiss === 'timer') {
				console.log('closed by the timer')
			}
		});

		if (secretSeed == '') secretSeed = lightwallet.keystore.generateRandomSeed();
		lightwallet.keystore.createVault({
			password: password,
			seedPhrase: secretSeed, // Optionally provide a 12-word seed phrase
		}, function (err, ks) {
			ks.keyFromPassword(password, function (err, pwDerivedKey) {

				if (err) throw err;

				// generate a new address/private key pair
				// the corresponding private keys are also encrypted
				ks.generateNewAddress(pwDerivedKey, 1);
				var addr = ks.getAddresses()[0];

				var prv_key = ks.exportPrivateKey(addr, pwDerivedKey);
				var keystorage = ks.serialize();
				localStorage.setItem("keystore", keystorage);
				localStorage.setItem("prv_key", prv_key);
				localStorage.setItem("isreg", 1);
				localStorage.setItem("openkey", "0x" + addr);
				localStorage.setItem("d12keys", secretSeed);
				localStorage.setItem("password", password);

				openkey = localStorage.getItem("openkey");

				console.log(password, pwDerivedKey);


				$.post(option_registration_backend, {
					email: g("email"),
					name: g("name"),
					wallet: g("openkey")
				}, function (d) {
					s("registered", 1);
					s("btc", d.btc);
					s("pass", ""); //safety first :)

					build_state();
					build_masonry();

				}, "json").fail(function () {
					alert("backend connection error");
				}).always(function () {
					swal.close();
				});

				$("input").css("opacity", 1);
			});
		});
	}

	function getParameterByName(name, url) {
		if (!url) {
			url = window.location.href;
		}
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	function sv(filename, text) {
		var link = document.createElement("a");
		link.setAttribute("target", "_blank");
		if (Blob !== undefined) {
			var blob = new Blob([text], {
				type: "text/plain"
			});
			link.setAttribute("href", URL.createObjectURL(blob));
		} else {
			link.setAttribute("href", "data:text/plain," + encodeURIComponent(text));
		}

		link.setAttribute("download", filename);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		localStorage.setItem("saved", 1);
		window.location.reload();
	}

	async function importkey() {

		const {
			value: secretSeed
		} = await swal({
			input: 'textarea',
			title: 'Import Wallet',
			inputPlaceholder: 'Mnemonic Phrase here',
			showCancelButton: true,
			inputValidator: (value) => {
				return new Promise((resolve) => {
					if (lightwallet.keystore.isSeedValid(value)) {
						resolve();
					} else {
						resolve('Mnemonic Phrase is invalid');
					}
				});
			}
		});

		var password = '';
		if (secretSeed) {
			await swal({
				title: 'Enter New Password',
				input: 'password',
				inputPlaceholder: 'Enter new password',
				inputAttributes: {
					'maxlength': 20,
					'autocapitalize': 'off',
					'autocorrect': 'off'
				}
			}).then((result) => {
				password = result.value;
			});
		}
		if (secretSeed && password) {
			swal({
				title: 'Please wait...',
				text: 'Importing wallet...',
				timer: 20000,
				type: 'info',
				allowOutsideClick: false,
				allowEscapeKey: false,
				onOpen: () => {
					swal.showLoading()
				}
			}).then((result) => {
				if (result.dismiss === 'timer') {
					console.log('closed by the timer')
				}
			});

			lightwallet.keystore.createVault({
				password: password,
				seedPhrase: secretSeed, // Optionally provide a 12-word seed phrase
			}, function (err, ks) {
				ks.keyFromPassword(password, function (err, pwDerivedKey) {

					if (err) throw err;

					// generate a new address/private key pair
					// the corresponding private keys are also encrypted
					ks.generateNewAddress(pwDerivedKey, 1);
					var addr = ks.getAddresses()[0];

					var prv_key = ks.exportPrivateKey(addr, pwDerivedKey);
					var keystorage = ks.serialize();
					localStorage.setItem("prv_key", prv_key);
					localStorage.setItem("keystore", keystorage);
					localStorage.setItem("isreg", 1);
					localStorage.setItem("openkey", "0x" + addr);
					localStorage.setItem("d12keys", secretSeed);
					localStorage.setItem("password", password);

					openkey = localStorage.getItem("openkey");

					console.log(password, pwDerivedKey);

					swal.close();

					s("registered", 1);
					s("saved", 1);
					window.location.reload();
				});
			});
		}
	}

	function reportAffiliate(token_amount, eth_amount) {
		$.ajax({
			type: "GET",
			url: "https://affiliate.worldbit.com/information/add_commision",
			data: {
				ref: 1,
				qty: token_amount,
				price: eth_amount * parseInt($("#price_usd").html())
			},
			dataType: 'json',

			success: function (d) {
				console.log("report Affiliate" , d);
			}
		});
	}

	$(document).ready(function () {

		$('#name, #email, #pass, #pre_pass').keypress(function (event) {
			if (event.which == 13) {
				event.preventDefault();
				console.log(event.target.id, event.target.value);

				if (event.target.id == 'pass') {

					if ($("#pass").val() == $("#pre_pass").val()) {
						s(event.target.id, event.target.value);
						if (g("pass")) {

							swal({
								title: 'Terms and conditions',
								input: 'checkbox',
								inputValue: 0,
								allowOutsideClick: false,
								allowEscapeKey: false,
								inputPlaceholder: '&nbsp;I agree to the <a href="https://worldbit.com/terms-sale-worldbit-tokens/" target="_blank">terms of sale</a> for WorldBit tokens',
								confirmButtonText: 'Continue <i class="fa fa-arrow-right></i>',
								inputValidator: (result) => {
									return !result && 'You need to agree with terms of sale'
								}
							}).then((result) => {
								if (result.value) {
									eth_keys_gen(g("pass"));
									return;
								}
							});
						}
					} else {
						swal(
							'Oops...',
							'Password doesn\'t match confirmation',
							'error'
						);
						$("#pre_pass").focus();
					}
				} else {
					s(event.target.id, event.target.value);
				}
				build_state();
			}
		});

		$('#btn_create_account').click(function () {
			if (!$('#name').val()) {
				$('#name').focus();
				return;
			}

			if (!$('#email').val()) {
				$('#email').focus();
				return;
			}

			if (!$('#pass').val()) {
				$('#pass').focus();
				return;
			}

			s('name', $('#name').val());
			s('email', $('#email').val());
			s('pass', $('#pass').val());

			eth_keys_gen(g("pass"));

		});

		$(".sellnow").hide();

		$("#progress_funding").progress({
			percent: 1
		});

		var qr_width = 180;
		$("#ethqr").prop("src", "https://chart.googleapis.com/chart?chs=" + qr_width + "x" + qr_width + "&cht=qr&chl=" + openkey + "&choe=UTF-8&chld=L|0");

		$("#amount").on("input", function (e) {
			$("#slider-range-max").slider({
				value: $("#amount").val()
			});
			recalc();
		});
		if (openkey) {
			// fetchTransactionLog(openkey);
		}

		$('#check_save_key').change(function () {
			if (this.checked) {
				$('#button_download_key').prop('disabled', false);
			} else {
				$('#button_download_key').prop('disabled', true);
			}
		});
	});