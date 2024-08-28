const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},


			login: async (email, password, setError) => {
				try {
					if (!email || !password) {
						setError('Por favor, ingresa tu correo electrónico y contraseña.');

					}
					const response = await fetch(process.env.BACKEND_URL + "/api/login", {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},

						body: JSON.stringify({
							email: email,
							password: password
						})
					});

					if (!response.ok) {
						const errorData = await response.json();
						const errorMessage = errorData.message || 'Email o contraseña incorrectos';
						setError({ general: errorMessage });

						return false;
					}
					const data = await response.json();
					const token = data.access_token;
					if (!token) {
						throw new Error('Token no recibido en la respuesta de inicio de sesión');
					}

					localStorage.setItem('authToken', token);
					setStore({ user: data.user, authToken: token });  // judit actualiza el estado del usuario
					return true;

				} catch (error) {
					setError(error.message);
				}

			},


			
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
