import { useEffect, useState, useRef } from "react";
//usando UserEffect ele vai executar o banco de dados assim que a pagina abrir
import "./style.css";
import api from "../../services/api";

function Home() {
  const [users, setUsers] = useState([]);
  // let podemos atribuir outros valores

  const inputName = useRef();
  const inputAge = useRef();
  const inputEmail = useRef();

  async function getUsers() {
    const usersFromApi = await api.get("/usuarios");
    // vamos chamar os usuarios pelo banco de dados atraves do GET
    setUsers(usersFromApi.data);
  }
// <button onClick={() =>deleteUsers(user.id)}> - regra do react tem que ser usado assim se nao o react trava 
  async function createUsers() {
    await api.post("/usuarios", {
      name: inputName.current.value,
      age: inputAge.current.value,
      email: inputEmail.current.value,
    })

    getUsers()
  }

  async function deleteUsers(id) {
    await api.delete(`/usuarios/${id}`)
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="container">
      <form>
        <h1>Cadastro Obitec User</h1>
        <input placeholder="NOME" name="nome" type="text" ref={inputName} />
        <input placeholder="IDADE" name="idade" type="number" ref={inputAge} />
        <input placeholder="EMAIL" name="email" type="email" ref={inputEmail} />
        <button type="button" onClick={createUsers}>
          Cadastrar
        </button>
      </form>

      {users.map((user) => (
        <div key={user.id} className="card">
          <div>
            <p>
              <span>Nome: {user.name}</span>
            </p>
            <p>
              {" "}
              <span>Idade: {user.age}</span>
            </p>
            <p>
              <span>Email: {user.email}</span>
            </p>
          </div>
          <button onClick={() => deleteUsers(user.id)}>
            <p>Dell</p>
          </button>
        </div>
      ))}
    </div>
  );
}

export default Home;
