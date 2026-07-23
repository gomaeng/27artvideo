// 1. 카테고리별 영상 데이터 관리 (음소거 파라미터 포함)
const videoData = {
    virtual: [
        "https://www.youtube.com/embed/bAyoyEjoGTk?enablejsapi=1&mute=1",
        "https://www.youtube.com/embed/SF8A4xyqFao?enablejsapi=1&mute=1",
        "https://www.youtube.com/embed/IURzJyNKPeI?enablejsapi=1&mute=1",
        "https://www.youtube.com/embed/4Xw2OGb1Ov0?enablejsapi=1&mute=1",
        "https://www.youtube.com/embed/gV3tQwC8460?enablejsapi=1&mute=1"
    ],
    animation: [
        "https://www.youtube.com/embed/0JQd5jgnr5E?enablejsapi=1&mute=1",
        "https://www.youtube.com/embed/ZUtbGVN3laQ?enablejsapi=1&mute=1",
        "https://www.youtube.com/embed/QgmDhos7L_8?enablejsapi=1&mute=1",
        "https://www.youtube.com/embed/fTyGglvu-gE?enablejsapi=1&mute=1",
        "https://www.youtube.com/embed/fKakToKSUBQ?enablejsapi=1&mute=1",
        "https://www.youtube.com/embed/ZMmmFClBwQQ?enablejsapi=1&mute=1",
        "https://www.youtube.com/embed/Dh4dTgTbSfI?enablejsapi=1&mute=1",
        "https://www.youtube.com/embed/wcWuBP-zv5U?enablejsapi=1&mute=1",
        "https://www.youtube.com/embed/-cK_wQLtCGk?enablejsapi=1&mute=1"
    ]
};

let currentCategory = 'virtual'; // 기본값
let currentIndex = 0;

const track = document.querySelector('.video-track');
const dotsContainer = document.querySelector('.video-dots');
const categoryNotice = document.getElementById('categoryNotice');

// 2. 모든 영상을 미리 렌더링하여 부드러운 슬라이딩 구현
function renderSlides() {
    track.innerHTML = '';
    const urls = videoData[currentCategory];

    urls.forEach((url, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.classList.add('video-slide');
        
        // 모든 iframe을 미리 로드해 두어 딱딱거리는 끊김 현상 방지
        slideDiv.innerHTML = `
            <div class="video-frame">
                <iframe src="${url}" title="YouTube video ${index + 1}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
        `;
        track.appendChild(slideDiv);
    });
}

// 3. 인디케이터 점 자동 생성
function createDots() {
    dotsContainer.innerHTML = '';
    const totalSlides = videoData[currentCategory].length;

    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === currentIndex) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            currentSlide(i);
        });
        
        dotsContainer.appendChild(dot);
    }
}

// 4. 슬라이드 위치 업데이트 및 안 보이는 영상 유튜브 정지 명령 전송
function updateSlide() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // 인디케이터 점 활성화 상태 변경
    const dots = document.querySelectorAll('.video-dots .dot');
    dots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    // 화면에서 벗어난 영상은 유튜브 API(postMessage)를 이용해 재생 멈춤(pause) 처리
    const slides = document.querySelectorAll('.video-slide');
    slides.forEach((slide, index) => {
        const iframe = slide.querySelector('iframe');
        if (iframe && index !== currentIndex) {
            iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
    });
}

// 5. 좌우 버튼 이동
function moveSlide(direction) {
    const totalSlides = videoData[currentCategory].length;
    currentIndex += direction;
    if (currentIndex < 0) {
        currentIndex = totalSlides - 1;
    } else if (currentIndex >= totalSlides) {
        currentIndex = 0;
    }
    updateSlide();
}

// 6. 특정 슬라이드로 이동
function currentSlide(index) {
    currentIndex = index;
    updateSlide();
}

// 7. 카테고리 전환 버튼 클릭 시 실행 함수
function switchCategory(category) {
    currentCategory = category;
    currentIndex = 0; // 카테고리 바뀔 때 첫 번째 영상으로 초기화
    
    // 탭 버튼 스타일 활성화 상태 변경
    const tabs = document.querySelectorAll('.category-btn');
    tabs.forEach(tab => {
        if (tab.getAttribute('onclick').includes(category)) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // 탭에 따른 안내 문구 변경
    if (currentCategory === 'virtual') {
        categoryNotice.innerText = '쇼케이스 영상은 천천히 업로드하고 있습니다.';
    } else {
        categoryNotice.innerText = '커버곡 작업은 커버곡 영상으로 업로드하고 있습니다.';
    }

    renderSlides();
    createDots();
    updateSlide();
}

// 페이지 로드 시 초기 렌더링 및 기본 문구 세팅
if (categoryNotice) {
    categoryNotice.innerText = '쇼케이스 영상은 천천히 업로드하고 있습니다.';
}
renderSlides();
createDots();
