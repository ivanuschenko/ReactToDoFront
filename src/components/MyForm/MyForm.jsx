import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyForm.scss';
import Delete from '../../img/delete.png';
import Edit from '../../img/edit.png';
import Cancel from '../../img/decline.png';
import Accept from '../../img/okey.png';
import DeleteAll from '../../img/delete_all.png';
const url = 'http://localhost:8000'

const MyForm = () => {
  const [tasks, setTasks] = useState([]);
  const [text, setTask] = useState('');
  const [form, setForm] = useState(false);
  const [taskIndex, setIndex] = useState('');
  const [inputValue, setInputValue] = useState('');

  useEffect(async () => {
    await axios.get(`${url}/allTasks`).then(res => {
      setTasks(res.data);
    });
  }, []);

  const addNewTask = async (e) => {
    e.preventDefault();
    await axios.post(`${url}/createTask`, {
      text,
      isCheck: false
    }).then(res => {
      setTask('');
      const newTask = [...tasks];
      newTask.push(res.data);
      setTasks(newTask);
    });
  };

  const changeComponent = (temp) => {
    setForm(true);
    setIndex(temp);
  }

  const editImg = async (id) => {
    await axios.patch(`${url}/updateTask`, {
      _id: id,
      text: inputValue,
    }).then(res => {
      setTasks(res.data);
    });
  };

  const changeStyle = async (key, isCheck, id) => {
    !isCheck ? isCheck = true : isCheck = false;
    await axios.patch(`${url}/updateTask`, {
      _id: id,
      isCheck: isCheck
    }).then(res => {
      setForm(false);
      setTasks(res.data);
    });
  };

  const deleteTask = async (id) => {
    await axios.delete(`${url}/deleteTask?_id=${id}`, {
      _id: id
    }).then(res => {
      setTasks(res.data);
    });
  };

  const deleteAllTask = async() => {    
    await axios.delete(`${url}/deleteAll`,).then(res => {
      setTasks([]);
    });
  };

  const cancelEdit = () => {
    setForm(false);
    setTasks(tasks);
  };

  return (
    <div>
      <form className="inputForm" >
        <input
          type="text"
          value={text}
          onChange={(e) => setTask(e.target.value)}
          placeholder="unput your task"
          className="myInput"
        />
        <button
          onClick={(e) => addNewTask(e)} className="myBtn">Pick!
        </button>
        <img 
          src={DeleteAll} 
          alt="deleteAllTask"
          className="deleteAll"
          onClick={(e) => deleteAllTask(e)} 
        />
          
      </form>
      <div className="TaskList">
        {
          tasks
            .sort((a, b) => {
              if (a.isCheck === b.isCheck) return 0;
              return (a.isCheck > b.isCheck ? 1 : -1);
            })
            .map((task, index) =>
              <div className="task" key={`task-${index}`}>
                {form &&
                  taskIndex === `task-${index}` ?
                  <>
                    <input 
                      type="text" 
                      placeholder={task.text} 
                      value={inputValue} 
                      onChange={(e) => setInputValue(e.target.value)} />
                    <img 
                      src={Cancel} 
                      alt="Cancel" 
                      onClick={() => cancelEdit()} 
                    />
                    <img 
                      src={Accept} 
                      alt="Accept" 
                      onClick={() => editImg(task._id)} 
                    />
                  </>
                  :
                  <>
                    <input
                      type="checkbox"
                      name="isCheck"
                      checked={task.isCheck}
                      onClick={() => changeStyle(`task-${index}`, task.isCheck, task._id)} id="isCheck" />
                    <p
                      className={
                        task.isCheck &&
                        "doneTask"
                      }>
                      {task.text}
                    </p>
                    <img 
                      src={Edit} 
                      className="img" 
                      onClick={() => changeComponent(`task-${index}`)}>                       
                    </img>
                    <img 
                      src={Delete} 
                      className="img" 
                      onClick={() => deleteTask(task._id)}>                        
                    </img>
                  </>
                }
              </div>
            )
        };
      </div>
    </div>
  )
};

export default MyForm;


