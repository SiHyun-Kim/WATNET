var detailMainElem = document.querySelector('.detail-main-container')
var detailHeaderElem = document.querySelector('.detail-header')
var detailTitleElem = document.querySelector('.detail-title-container')
var detailLeaderElem = document.querySelector('.detail-leader-container')
var detailStartDtElem = document.querySelector('.detail-startDt')
var detailEndDtElem = document.querySelector('.detail-endDt')
var detailUserElem = document.querySelector('.detail-user-table')
var detailTextElem = document.querySelector('.detail-text')

var hiddenBoardPkElem = document.querySelector('#hiddenBoardPk')
var hiddenUserPkElem = document.querySelector('#loginUserPk')
var hiddenUserPointElem = document.querySelector('#lgoinUserPoint')

var detailCancleBtn = document.querySelector('#detail-cancleBtn')
var detailSubBtnElem = document.querySelector('#detail-submitBtn')
var detailDelBtnElem = document.querySelector('#detail-deleteBtn')

selBoard()
selUserProfile()

function selBoard() {
	fetch(`/boardAjax/selBoard?boardPk=${hiddenBoardPkElem.value}`)
	.then(function(res) {
		return res.json()
	}).then(function(myJson) {
		makeDetail(myJson)
		detailCancleBtn.addEventListener('click', function() {
			backToList(myJson.category)
		})
	})
}

function selUserProfile() {
	fetch(`/boardAjax/selUserProfile?boardPk=${hiddenBoardPkElem.value}`)
	.then(function(res) {
		return res.json()
	}).then(function(myJson) {
		myJson.forEach(function(item) {
			makeUser(item)
		})
		for(var i=1; i<=(4-myJson.length); i++) {
			makeNoneUser()
		}
	})
}

function backToList(category) {
	if(category == 1) {
		location.href="/board/netflix"
	} else if(category == 2) {
		location.href="/board/watcha"
	}
}

function makeUser(myJson) {
	var userContainerElem = document.createElement('div')
	userContainerElem.classList.add('user-container')
	userContainerElem.innerHTML = 
	`
	<img src="/res/img/user/${myJson.userPk}/${myJson.profileImg}" alt="profile image" onerror="this.src='/res/img/profileImg.png'">
    <span>${myJson.nickname}</span>
	`
	detailUserElem.append(userContainerElem)
}

function makeNoneUser() {
	var userContainerElem = document.createElement('div')
	userContainerElem.classList.add('user-container')
	userContainerElem.innerHTML = 
	`
	<img src="/res/img/default-profileImg.png" alt="profile image">
    <span>???????????????</span>
	`
	detailUserElem.append(userContainerElem)
}

function makeDetail(item) {
	
	if(item.category == 1){
		
		detailHeaderElem.innerHTML =
		`
		<h2>NETFLIX</h2>
        <button id="makePartyBtn" type="button">?????? ?????????</button>
		`
		
		detailTitleElem.innerHTML = 
		`
		<img class="detail-title-img" src="/res/img/detail-netflix.jpg" alt="netflix logo">
        <div class="detail-title-span">
            <span class="detail-title-categoryNm">???????????? ????????????</span>
            <span class="detail-title">${item.title}</span>
        </div>
		`
	}  else if(item.category == 2) {
		
		detailHeaderElem.innerHTML =
		`
		<h2>WATCHA</h2>
        <button id="makePartyBtn" type="button">?????? ?????????</button>
		`
		
		detailTitleElem.innerHTML = 
		`
		<img class="detail-title-img" src="/res/img/detail-watcha.jpg" alt="netflix logo">
        <div class="detail-title-span">
            <span class="detail-title-categoryNm">?????? ????????????</span>
            <span class="detail-title">${item.title}</span>
        </div>
		`
	}
	
	detailLeaderElem.innerHTML = 
	`
	<div class="leader-info">
        <img class="leader-profileImg" src="/res/img/profileImg.png" alt="leader-profile image">
        <span>${item.nickname}</span>
    </div>
    <span>?????? ?????? : ${item.boardPk}</span>
	`
	
	function getStringDay(date) {
		let year = date.getFullYear() // ??????
		let month = "" + (date.getMonth() + 1)  // ???
		if(month.length < 2) {
			month = "0" + month
		}
		let day = "" + date.getDate()  // ??????
		if(day.length < 2) {
			day = "0" + day
		}
	
		let StringDay = year + '-' + month + '-' + day
	
		return StringDay
	}
	
	let startDt = new Date(item.startDt)
	let endDt = new Date(item.endDt)
	
	let now = new Date()
	let nowDtString = getStringDay(now)
	let nowDt = new Date(nowDtString)

	let leftStartDays = Math.ceil((startDt.getTime()-nowDt.getTime())/(1000*3600*24))
	let leftLastDays = Math.ceil((endDt.getTime()-startDt.getTime())/(1000*3600*24))
	
	
	detailStartDtElem.innerHTML = 
	`
	<span id="startDt-span">????????? : ${item.startDt} (${leftStartDays})???</span>
	`
	
	detailEndDtElem.innerHTML = 
	`
	<span id="endDt-span">????????? : ${item.endDt} (${leftLastDays})???</span>
    <span>?????? ?????? : <span class="redSpan"> ${numberWithCommas(item.price)}</span> ???</span>
	`
	
	detailTextElem.innerHTML = 
	`
	<p id="detail-ctnt">${item.ctnt}</p>
	<div class="detail-checkbox">
        <input id="detail-checkbox" type="checkbox">
        <span>????????? ?????? ?????? ??? ????????? ?????????????????????.</span>
    </div>
	`
	var detailChkBoxElem = document.querySelector('#detail-checkbox')
	
	function joinParty() {
		if(!detailChkBoxElem.checked) {
			alert('????????? ?????? ?????? ??? ????????? ???????????? ?????????.')
			detailChkBoxElem.focus()
			return
		}
		
		if(hiddenUserPkElem.value == '') {
			alert('???????????? ????????? ?????? ?????? ????????? ???????????????.')
			location.href="/user/login"
			return
		}
		
		if(confirm(`?????? ??????????????? ???????????????????\n???????????? ?????? Point?????? ${numberWithCommas(item.price)}??? ?????? ???????????????.\n?????? ???????????? ?????? POINT : ${numberWithCommas(hiddenUserPointElem.value)}`) == true) {
			var param = {
				boardPk : hiddenBoardPkElem.value,
				userPk : hiddenUserPkElem.value,
			}
			
			fetch(`/boardAjax/joinParty`, {
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(param)
			}).then(function(res) {
				return res.json()
			}).then(function(myJson) {
				if(myJson == -1) {
					alert('?????? ?????? ????????? ????????????????????????.')
					location.href = `/user/myParty?userPk=${hiddenUserPkElem.value}`
					return
				} else if(myJson == -2) {
					alert('???????????? point??? ???????????????.')
					location.href = `/user/plusPoint?userPk=${hiddenUserPkElem.value}`
					return
				} else {
					alert('?????? ?????? ?????? ??????')
					location.href = `/user/myParty?userPk=${hiddenUserPkElem.value}`
					return
				}
			})
		} else {
			return
		}
	}
	detailSubBtnElem.addEventListener('click', joinParty)

	var makePartyElem = document.querySelector('#makePartyBtn')
	var loginUserElem = document.querySelector('#loginUserPNum')
	if(makePartyElem) {
		function makeParty() {
			if(loginUserElem.value == null || loginUserElem.value === '') {
				alert('???????????? ???????????? ????????? ????????? ????????????. ????????? ????????? ??????????????????.')
				//location.href = '????????? ??????'
				return;
			}
			location.href = '/board/makeParty?category=1'
		}
	
		makePartyElem.addEventListener('click', makeParty)
	}
}

function numberWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//board ?????? ??????
function delBoard() {
	if(confirm('?????? ?????????????????????????')==true) {
		fetch(`/boardAjax?userPk=${hiddenUserPkElem.value}`, {
			method: 'delete'
		}).then(function(res) {
			return res.json()
		}).then(function(myJson) {
			console.log(myJson)
			if(myJson == 1) {
				alert('????????? ?????????????????????.')
				location.href = `/user/myParty?userPk=${hiddenUserPkElem.value}`
			} else {
				alert('??????')
				return
			}
		})
	} else {
		return
	}
}
detailDelBtnElem.addEventListener('click', delBoard)
