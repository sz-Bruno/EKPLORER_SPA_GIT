export class GitHubuser{
    static search(username){
    const endpoint=`https://api.github.com/users/${username}`
     return fetch(endpoint)
     .then(data=>data.json())
     .then(data=>({
        login: data.login,
        name:data.name,
        public_repos:data.public_repos,
        followers:data.followers

     }))
   }
}
export class Favorites{
    constructor(root){
        this.root=document.querySelector(root)
        this.load()
        //GitHubuser.search('maykbrito').then(user=>console.log(user))
    }
    load(){
        this.entries=JSON.parse(localStorage.getItem('@github-favorites:'))|| []
        
    }
    save(){
        localStorage.setItem('@github-favorites:',JSON.stringify(this.entries))
        
    }
    page(){
        const page= document.querySelector('.vazio')
        if(this.entries==''){
            
            page.classList.remove('hiden') 
         }else{
             page.classList.add('hiden') 
         }
    }

    delete(user){
       
        const filteredentries= this.entries.filter(entrie=>entrie.name!== user.name)
         console.log(filteredentries)
         this.entries= filteredentries
        this.page()
        
         this.update()
         this.save()

    }
    async add(username){
        
       try{
        const userexist= this.entries.find(entry=> entry.login===username)
        
        if(userexist){
            throw('usuario ja existente')
        }
        
        const gituser= await GitHubuser.search(username)
        if(gituser.login===undefined){
            throw('Usuário não encontrado')
        }
       
        this.entries=[gituser,...this.entries]
        this.update()
        this.save()
        }catch(error){
            alert(error.message)
        }
        
    }
    
}
export class FavoritesView extends Favorites{
    
    constructor(root){
        super(root)
        this.tbody= document.querySelector('table tbody')
       this.update()
      this.onadd()
    
       
    }
    onadd(){
        const page=document.querySelector('.vazio')
        const addButton=this.root.querySelector('.search button')
        addButton.onclick=()=>{
            if(this.entries===''){
               page.classList.remove('hiden') 
            }else{
                page.classList.add('hiden') 
            }
            
            const {value}=this.root.querySelector('.search input')
            this.add(value)
        }
        
    }
    
    update(){
        
       this.removealltr()
       this.entries.forEach(user=>{
        const row= this.createrow()
        row.querySelector('.user img ').src=`https://github.com/${user.login}.png`
        row.querySelector('.user p ').textContent=`${user.name}`
        row.querySelector('.user span ').textContent=`${user.login}`
        row.querySelector('.repositories  ').textContent=`${user.public_repos}`
        row.querySelector('.followers ').textContent=`${user.followers}`
        row.querySelector('.remove ').onclick=()=>{ 
           const confirmation= confirm('Tem certeza que deseja excluir?')
                if(confirmation){
                    this.delete(user)
                    
            }}
        this.tbody.append(row)
       })
      
        
        
    }
    createrow(){
        const tr= document.createElement('tr')
        tr.innerHTML=
        `
        <td class="user">
        <img src="https://github.com/sz-Bruno.png" alt="" srcset="">
        <a href="https://github.com/sz-bruno"target=_blank>
            <p>Bruno de Souza</p>
            <span>sz-Bruno</span>
        </a>
    </td>
    <td class="repositories">200</td>
    <td class="followers">354</td>
    <td><button class="remove">Remover</button></td>`
      
        return tr
}
    removealltr(){
    
     this.tbody.querySelectorAll('tr').
     forEach(tr=>tr.remove())
     
     
     
     
    }
  
}
