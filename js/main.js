const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('.site-nav');
menuButton?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',open)});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuButton?.setAttribute('aria-expanded','false')}));
document.getElementById('year').textContent=new Date().getFullYear();
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

const track=document.querySelector('[data-gallery-track]');
const prev=document.querySelector('.carousel-btn.prev');
const next=document.querySelector('.carousel-btn.next');
const dotsWrap=document.querySelector('.gallery-dots');
if(track){
  const slides=[...track.querySelectorAll('figure')];
  slides.forEach((_,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',`Go to gallery image ${i+1}`);b.addEventListener('click',()=>slides[i].scrollIntoView({behavior:'smooth',block:'nearest',inline:'start'}));dotsWrap.appendChild(b)});
  const dots=[...dotsWrap.children];
  const update=()=>{const left=track.scrollLeft;let best=0,dist=Infinity;slides.forEach((s,i)=>{const d=Math.abs(s.offsetLeft-left-track.offsetLeft);if(d<dist){dist=d;best=i}});dots.forEach((d,i)=>d.classList.toggle('active',i===best))};
  const step=()=>track.clientWidth*.72;
  prev?.addEventListener('click',()=>track.scrollBy({left:-step(),behavior:'smooth'}));
  next?.addEventListener('click',()=>track.scrollBy({left:step(),behavior:'smooth'}));
  track.addEventListener('scroll',()=>requestAnimationFrame(update));update();
}

// DJ GUC dual theme-song player
const audioPlayer=document.querySelector('[data-audio-player]');
if(audioPlayer){
  const audio=audioPlayer.querySelector('[data-audio]');
  const playButton=audioPlayer.querySelector('[data-play]');
  const previousButton=audioPlayer.querySelector('[data-previous]');
  const nextButton=audioPlayer.querySelector('[data-next]');
  const title=audioPlayer.querySelector('[data-track-title]');
  const status=audioPlayer.querySelector('[data-player-status]');
  const progress=audioPlayer.querySelector('[data-progress]');
  const currentTime=audioPlayer.querySelector('[data-current-time]');
  const duration=audioPlayer.querySelector('[data-duration]');
  const playIcon=playButton.querySelector('span');
  const tracks=[
    {title:"Keep Bumpin' That Song — Full Mix",src:'audio/keep-bumpin-full-mix.mp3'},
    {title:"Keep Bumpin' That Song — Theme Edit",src:'audio/keep-bumpin-theme-edit.mp3'}
  ];
  let trackIndex=0;
  const formatTime=value=>{
    if(!Number.isFinite(value))return '0:00';
    const minutes=Math.floor(value/60);
    const seconds=Math.floor(value%60).toString().padStart(2,'0');
    return `${minutes}:${seconds}`;
  };
  const updatePlayState=()=>{
    const playing=!audio.paused;
    playButton.classList.toggle('is-playing',playing);
    playButton.setAttribute('aria-label',playing?'Pause theme track':'Play theme track');
    playIcon.textContent=playing?'❚❚':'▶';
    status.textContent=playing?`Now playing track ${trackIndex+1} of ${tracks.length}`:'Paused • Use arrows to switch tracks';
  };
  const loadTrack=(index,{autoplay=false}={})=>{
    trackIndex=(index+tracks.length)%tracks.length;
    const selected=tracks[trackIndex];
    audio.src=selected.src;
    title.textContent=selected.title;
    progress.value=0;
    currentTime.textContent='0:00';
    duration.textContent='0:00';
    status.textContent=`Track ${trackIndex+1} of ${tracks.length} ready`;
    audio.load();
    if(autoplay)audio.play().catch(()=>{status.textContent='Press play to start • Browser blocked automatic playback';});
  };
  playButton.addEventListener('click',()=>audio.paused?audio.play():audio.pause());
  previousButton.addEventListener('click',()=>loadTrack(trackIndex-1,{autoplay:!audio.paused}));
  nextButton.addEventListener('click',()=>loadTrack(trackIndex+1,{autoplay:!audio.paused}));
  audio.addEventListener('play',updatePlayState);
  audio.addEventListener('pause',updatePlayState);
  audio.addEventListener('loadedmetadata',()=>{duration.textContent=formatTime(audio.duration)});
  audio.addEventListener('timeupdate',()=>{
    currentTime.textContent=formatTime(audio.currentTime);
    progress.value=audio.duration?(audio.currentTime/audio.duration)*100:0;
  });
  audio.addEventListener('ended',()=>loadTrack(trackIndex+1,{autoplay:true}));
  progress.addEventListener('input',()=>{if(audio.duration)audio.currentTime=(Number(progress.value)/100)*audio.duration});
  loadTrack(0);
}
