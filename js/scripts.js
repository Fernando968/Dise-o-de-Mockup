let title_task = document.getElementById("title");
let description_task = document.getElementById("description");
let list_container = document.getElementById("list-container");
let save_btn = document.getElementById("boton");
let task_detail_dialog = document.getElementById("task-detail-dialog");
let close_dialog = document.getElementById("close-dialog");


let tasks = [];

const get_data_localstorage = () =>{
    if(localStorage.getItem("tasks")!=null){
        tasks = JSON.parse(localStorage.getItem("tasks"));
    }
}

const set_data_localstorage = () =>{
    if(title_task.value&&description_task.value){
        let data = {
            id: tasks.length+1,
            title: title_task.value,
            description: description_task.value,
            complete: false,
        }
        tasks.push(data);
    
        localStorage.setItem("tasks",JSON.stringify(tasks));
        print_tasks();
    
        title_task.value = "";
        description_task.value = "";
    }
    else{
        alert("Complete todos los campos");
    }
    
};

const print_tasks = ()=>{
    get_data_localstorage();
    list_container.innerHTML = "";
    tasks.forEach(e=>{
        list_container.insertAdjacentHTML("beforeend",`
        <p>
            <input id="check-${e.id} "class="cajita" type="checkbox" ${e.complete ? "checked" : ""}>
            ${e.title}
            <i id="detail-${e.id}"class="fas fa-eye"></i>
            <i id="edit-${e.id}"class="far fa-edit"></i>
            <i id="delete-${e.id}"class="fas fa-trash-alt"></i>
        </p>
        `)  
    })
}

const change_complete_state = (event)=>{
    let res = tasks.find((e) => "check" + e.id==event.target.id);
    if(res){
        res.complete = !res.complete;
        localStorage.setItem("tasks",JSON.stringify(tasks));
    }

};

const view_data = (id_detail)=>{
    let res = tasks.find(e=>"detail-"+e.id==id_detail)
    if(res){
        let task_detail_container = document.getElementById("task-detail")
        task_detail_container.innerHTML = "";
        task_detail_container.insertAdjacentHTML('beforeend',` 
        
            <h1 class="task-detail-title">${res.title}</h1>
            <p class="task-detail-description">
                ${res.description}
            </p>
            <div class="task-detail-complete">completo : ${res.complete?"SI":"NO"}</div>
        `);
        
    };
};

const generate_form = (id_edit)=>{
    let res = tasks.find(e=>"edit-"+e.id==id_edit)
    if(res){
        let task_detail_container = document.getElementById("task-detail")
        task_detail_container.innerHTML = "";
        task_detail_container.insertAdjacentHTML('beforeend',`

        <div class="task-edit-container">   
        <input type="text" id="title" placeholder="Titulo de la tarea" class="form-control" value="${res.title}">
        <textarea id="description" type="text" placeholder="Descripción de la tarea"  class="form-control">${res.description}</textarea>
        <button id="boton" type="submit">GUARDAR</button> 
        </div>
        `)
        let save_btn_edit = document.getElementById("boton")
        save_btn_edit.addEventListener("click",()=>{
            let title_task_edit = document.getElementById("title");
            let description_task_edit = document.getElementById("description");
            if(title_task_edit.value&&description_task_edit.value){
                let index_res = tasks.findIndex((e)=>e.id==res.id)
                console.log(index_res)
                tasks[index_res] = {
                    id: res.id,
                    title: title_task_edit.value,
                    description: description_task_edit.value,
                    complete: res.complete,
                };
                localStorage.setItem("tasks",JSON.stringify(tasks));
                print_tasks();
                task_detail_dialog.close();
            }
            else{
                alert("Complete todos los campos");
            }
        })
    }
}

const delete_data_by_id = (id) =>{
    let res_index = tasks.findIndex(e=>"delete-"+e.id==id)
    tasks.splice(res_index,1)
    localStorage.setItem("tasks",JSON.stringify(tasks));
    print_tasks();
};

save_btn.addEventListener("click",() =>{
    set_data_localstorage();
})

list_container.addEventListener("change ", (event) =>{
    change_complete_state(event);
});


list_container.addEventListener("click", (event)=>{
    if(event.target.matches(".fas.fa-eye")){
        task_detail_dialog.showModal();
        view_data(event.target.id);
    }
    else if(event.target.matches(".far.fa-edit")){
        task_detail_dialog.showModal();
        generate_form(event.target.id);
    }
    else if(event.target.matches(".fas.fa-trash-alt")){
        delete_data_by_id(event.target.id);

    }
});

close_dialog.addEventListener("click", ()=>{
    task_detail_dialog.close();

});
print_tasks();





