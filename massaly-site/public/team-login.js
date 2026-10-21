const teamForm=document.getElementById('team-login-form');
if(location.hash==='#team-login-form')document.querySelector('.team-login').open=true;
teamForm?.addEventListener('submit',async event=>{
 event.preventDefault();
 const status=teamForm.querySelector('.login-status');
 const button=teamForm.querySelector('button');
 const destination=window.open('about:blank','_blank');
 if(destination){destination.opener=null;destination.document.title='Signing in…';destination.document.body.textContent='Signing in to Massaly Lab…';}
 button.disabled=true;status.textContent='Signing in…';
 try{
  const response=await fetch('/team-login',{method:'POST',body:new URLSearchParams(new FormData(teamForm)),headers:{Accept:'application/json'},credentials:'same-origin'});
  const result=await response.json();
  if(!response.ok){destination?.close();status.textContent=result.error||'Unable to sign in. Please try again.';return;}
  teamForm.reset();
  if(destination&&!destination.closed){destination.location.replace('/member-resources');status.textContent='Signed in. Lab resources opened in a new tab.';}
  else{status.textContent='Signed in. ';const a=document.createElement('a');a.href='/member-resources';a.target='_blank';a.rel='noopener';a.textContent='Open lab resources';status.append(a);}
 }catch{destination?.close();status.textContent='Unable to connect. Please try again.';}
 finally{button.disabled=false;}
});
