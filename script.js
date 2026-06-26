'use strict';
// 常量定义
const titles = [
    '婺源','三清山','庐山',
    '黄鹤楼','神农架','武当山',
    '洪崖洞','武隆','大足',
    '九寨沟','峨眉山','大熊猫'
];
const imgs = [
    'Assets/婺源篁岭.jpg','Assets/三清山.jpg','Assets/庐山.jpg',
    'Assets/黄鹤楼.jpg','Assets/神农架.jpg','Assets/武当山.jpeg',
    'Assets/洪崖洞.jpg','Assets/武隆天生三桥.jpg','Assets/大足石刻.jpg',
    'Assets/九寨沟.jpeg','Assets/峨眉山.jpg','Assets/成都大熊猫基地.jpg'
];
const infos = [
    '婺源篁岭（上饶）<br>“中国最美乡村”，3–4 月油菜花、9–12 月晒秋，徽派古村 + 梯田景观。',
    '三清山（上饶）<br>“江南第一仙峰”，花岗岩峰林 + 云海，巨蟒出山、东方女神等奇石标志性强。',
    '庐山（九江）<br>世界文化遗产，“匡庐奇秀甲天下”，以云海、瀑布、别墅群闻名，避暑胜地。',
    '黄鹤楼（武汉）<br>“天下江山第一楼”，江南三大名楼之一，崔颢题诗地，俯瞰长江大桥。',
    '神农架（宜昌 / 神农架林区）<br>世界自然遗产，原始森林 +“华中屋脊”，神秘野人传说，避暑与生态科考胜地。',
    '武当山（十堰）<br>道教圣地、世界文化遗产，“亘古无双胜境”，金顶、紫霄宫等古建筑群宏伟。',
    '洪崖洞（渝中区）<br>8D 魔幻吊脚楼，夜景神似《千与千寻》，巴渝民俗 + 江景美食集中地。',
    '武隆天生三桥（武隆区）<br>世界自然遗产，三座天然石拱桥，《变形金刚 4》取景地，天坑峡谷壮观。',
    '大足石刻（大足区）<br>世界文化遗产，唐宋石窟造像 5 万余尊，佛教艺术巅峰之作。',
    '九寨沟（阿坝）<br>“九寨归来不看水”，彩林、翠海、叠瀑、雪峰，童话世界，世界自然遗产。',
    '峨眉山 + 乐山大佛（乐山）<br>峨眉山为佛教名山、世界文化与自然双遗产；乐山大佛高 71 米，唐代摩崖石刻，世界最大佛像之一。',
    '成都大熊猫基地（成都）<br>全球最大科研繁育基地，看国宝大熊猫、幼崽卖萌，成都必打卡。'
];
const chapterTitles = ["第一站：江西省", "第二站：湖北省", "第三站：重庆市", "第四站：四川省"];
const bgImages = [
    'url("Assets/江西省.jpg")',
    'url("Assets/湖北省.jpg")',
    'url("Assets/重庆市.jpg")',
    'url("Assets/四川省.png!w1024_new_small_1")'
];
const chapters = [
    document.getElementById('chapter-1'),
    document.getElementById('chapter-2'),
    document.getElementById('chapter-3'),
    document.getElementById('chapter-4')
];
const btnMenu = document.querySelectorAll('.menu-btn');
const mainMenu = document.getElementById('main-header');
const nodes = document.querySelectorAll('.location-node');
const modalScenery = document.getElementById('scenery-modal');
const modalAtlas = document.getElementById('atlas-modal');
const overlay = document.getElementById('overlay');
const topBar = document.getElementById('top-bar');
const bgm = document.getElementById('bgm');
const atlasView = document.getElementById('atlas-view');
const aboutView = document.getElementById('about-view');
const btnShow = document.getElementById("show-btn");
const returnMainMenu = document.querySelectorAll('.btn-return');
const changeBgImg = document.querySelector('#change-bgimg');
const prevBtn = document.querySelectorAll('.prev-btn');
const nextBtn = document.querySelectorAll('.next-btn');
const selectChapter = document.getElementById('select-chapter');
const chapterOptions = document.querySelectorAll('.chapter-option');
const btnMove = document.getElementById('btn-confirm-move');
const btnStopMusic = document.getElementById('stop-music');

// 变量定义
let isPlayMusic = true;
let isMainMenu = true;
let hideTimer = 3000;
let currentChapterIndex = 0;
let currentNodeIndex = 0;
let targetNode = null;

// 初始化地点
function initLocation() {
    nodes.forEach((node, index)=> {
        node.innerText = titles[index];
        node.setAttribute('data-img', imgs[index]);
        node.setAttribute('data-info', infos[index]);
        node.addEventListener('click', () => {
            targetNode = {nodeIndex: index};
            if(index === currentNodeIndex+1 || index === currentNodeIndex-1) {
                openModal(node, true);
            }else if(index === currentNodeIndex){
                openModal(node, false);
            }else{
                alert('距离过远，无法移动');
            }
        });
    });
}

// 开始旅程
function startGame() {
    currentNodeIndex = 0;
    currentChapterIndex = 0;
    mainMenu.classList.add('hidden');
    topBar.classList.remove('hidden');
    switchChapter(0);
}
function switchChapter(index) {
    currentChapterIndex = index;

    chapters.forEach(ch => ch.classList.add('hidden'));
    chapters[index].classList.remove('hidden');

    document.body.style.backgroundImage = bgImages[index];
    document.getElementById('chapter-title-display').innerText = chapterTitles[index];
    updateProgress();
    setTimeout(() => {
        movePlayerToNode(index * 3);
        currentNodeIndex = currentChapterIndex * 3;
    }, 50);
}
function nextChapter() {
    switchChapter(currentChapterIndex + 1);
}
function prevChapter() {
    switchChapter(currentChapterIndex - 1);
}
function showChapterSelect() {
    document.getElementById('chapter-modal').classList.remove('hidden');
}
function movePlayerToNode(index) {
    const node = nodes[index];
    const player = chapters[currentChapterIndex].querySelector('#player-avatar');
    const rect = node.getBoundingClientRect();
    const left = rect.left + rect.width / 2 - player.offsetWidth / 2;
    const top = rect.top + rect.height / 2 - player.offsetHeight / 2;

    player.style.left = `${left}px`;
    player.style.top = `${top}px`;
    currentNodeIndex = index;
    updateProgress();
}
function updateProgress() {
    document.getElementById('progress-display').innerText = `${currentNodeIndex + 1}/12`;
}
function openModal(node, showButton) {
    document.getElementById('modal-title').innerText = node.innerText;
    document.getElementById('modal-desc').innerHTML = node.getAttribute('data-info');
    document.getElementById('modal-img').src = node.getAttribute('data-img');
    if (showButton) {
        btnMove.classList.remove('hidden');
    }
    overlay.classList.remove('hidden');
    modalScenery.classList.remove('hidden');
}
function closeModal(confirmMove) {
    overlay.classList.add('hidden');
    modalScenery.classList.add('hidden');
    btnMove.classList.add('hidden');
    if (confirmMove) {
        movePlayerToNode(targetNode.nodeIndex);
    }
    targetNode = null;
};


// 风景图鉴
function openAtlas() {
    mainMenu.classList.add('hidden');
    atlasView.classList.remove('hidden');
    const listContainer = document.getElementById('atlas-list-container');
    listContainer.innerHTML = '';
    titles.forEach((title,index) => {
        const item = document.createElement('div');
        item.className = 'atlas-item';
        item.innerHTML = `
            <div class="atlas-img-box">
                <img src="${imgs[index]}" alt="${title}">
            </div>
            <div class="atlas-info-box">
                <h3>${title}</h3>
                <p>${infos[index]}</p>
            </div>
        `;
        listContainer.appendChild(item);
        item.addEventListener('click',function() {
            openAtlasModal(title, infos[index], imgs[index]);
        });
    });
}

function openAtlasModal(title, desc, img) {
    const modal = document.getElementById('atlas-modal');
    const mTitle = document.getElementById('modal-title-aside');
    const mBody = document.getElementById('modal-body');

    mTitle.innerText = title;
    mBody.innerHTML = `<img src="${img}" style="width:100%; border-radius:8px; margin-bottom:15px;" id="to-change"><p>${desc}</p>`;
    modalAtlas.classList.remove('hidden');
}
function closeAtlasModal() {
    modalAtlas.classList.add('hidden');
}


// 专心欣赏
function hideMainMenu(){
    mainMenu.classList.add('hidden');
    btnShow.classList.remove('hidden');
    isMainMenu = 0;
}
function showMainMenu(){
    mainMenu.classList.remove('hidden');
    btnShow.classList.add('hidden');
    isMainMenu = 1;
}

// 关于网站
function openAbout() {
    mainMenu.classList.add('hidden');
    aboutView.classList.remove('hidden');
}
function stopMusic() {
    if(isPlayMusic){
        bgm.pause();
        isPlayMusic = false;
    }else{
        bgm.play();
        isPlayMusic = true;
    }
}

//通用返回主菜单
function returnToMenu() {
    document.getElementById('chapter-modal').classList.add('hidden');
    topBar.classList.add('hidden');
    chapters.forEach(ch => ch.classList.add('hidden'));
    mainMenu.classList.remove('hidden');
    isMainMenu = true;
}
function showMainMenu() {
    btnShow.classList.add('hidden');
    aboutView.classList.add('hidden');
    atlasView.classList.add('hidden');
    mainMenu.classList.remove('hidden');
    isMainMenu = true;
}

//初始化
function initApp() {
    initLocation();

    btnMenu[0].addEventListener('click',startGame);
    btnMenu[1].addEventListener('click',openAtlas);
    btnMenu[2].addEventListener('click',hideMainMenu);
    btnMenu[3].addEventListener('click',openAbout);

    document.getElementById('btn-return-menu').addEventListener('click',returnToMenu);

    returnMainMenu.forEach(btn => btn.addEventListener('click',showMainMenu));

    document.getElementsByClassName('modal-close')[0].addEventListener('click',closeAtlasModal);

    btnMove.addEventListener('click', () => {
        movePlayerToNode(targetNode.nodeIndex);
        closeModal(false);
    });

    changeBgImg.addEventListener('click',(toChange) => {
        document.body.style.backgroundImage = `url(${document.getElementById('to-change').src})`;
        console.log(document.getElementById('to-change').src);
        alert('背景已修改');
    })

    overlay.addEventListener('click', () => closeModal(false));

    selectChapter.addEventListener('click', showChapterSelect);

    chapterOptions.forEach((option, index) => {
        if(index < 4){
            option.addEventListener('click', () => {
                switchChapter(index)
            });
        }else{
            option.addEventListener('click', () => {
                document.getElementById('chapter-modal').classList.add('hidden');
            });
        }
    });
    
    prevBtn.forEach(btn => btn.addEventListener('click',prevChapter));
    nextBtn.forEach(btn => btn.addEventListener('click',nextChapter));

    document.addEventListener('mousemove', function(){
        clearTimeout(hideTimer);
        if(!isMainMenu){
            btnShow.classList.remove('hidden');
        }
        hideTimer = setTimeout(function(){
            btnShow.classList.add('hidden');
        }, 3000)
    })

    btnStopMusic.addEventListener('click',stopMusic);
}

//页面加载完成后执行初始化函数
document.addEventListener('DOMContentLoaded', initApp);