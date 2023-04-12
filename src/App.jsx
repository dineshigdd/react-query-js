import { useQuery,
  useMutation, useQueryClient
 } from '@tanstack/react-query';
import './App.css'
import { useState, useEffect , useRef } from 'react';





function App() {

  return(
  
      <Products />
  
  )

}


function Products(){
 
  const inputEl = useRef(null);
  const queryClient = useQueryClient()
  

  const getProducts = () => fetch( 'https://64361a378205915d34ec0e89.mockapi.io/products')
                            .then( 
                            res  => res.json() ) 
  


   const query = useQuery( { queryKey: ['products'],   queryFn: getProducts })
  

   

   const mutation = useMutation({
         mutationFn : ( product ) => {
          const { method, url, name } = product ;

          return fetch( url, { 
            method, 
            headers: {
              "Content-Type": "application/json",          
           },
            body: JSON.stringify(name) });
          },
        
          onSuccess: ( data ) => console.log( data )
          ,          
          
          onError: (error) => {
            console.error('Error:', error);
          },
        
   }
  );

  const handleCreate = ( name ) => {
    mutation.mutate({ method: 'POST', url: 'https://64361a378205915d34ec0e89.mockapi.io/products',  name : name  });
  };

  

  const handleUpdate = ( product ) => {
    mutation.mutate({ method: 'PUT', url: `https://64361a378205915d34ec0e89.mockapi.io/products/${ product.id }`
    , data: { id: product.id, name: product.name } });
  }; 

  // const handleDelete = ( id) => {
  //   mutate.mutate({ method: 'DELETE', url: `https://64361a378205915d34ec0e89.mockapi.io/products/${ id }` });
  // };


  if ( query.isLoading) return 'Loading...'

  if ( query.isError) return 'An error has occurred: ' + query.error + query.status
  
  queryClient.invalidateQueries['products'];

  return(
    <>
      <form>
          <label>product:</label><input ref={inputEl} type="text" />
         
      </form>
      <ul>
        { 
        query.data.map( product => 
        <li key={ product.id }>{ product.name }
        {/* <button onClick={ ()=>{ handleDelete( product.id )}}>delete</button> */}
        <button onClick={ ()=>handleUpdate( { id:product.id , name: inputEl.current.value } )}>Update</button>
        </li>
      
        
        ) 
        }
      </ul>
          
      <div>
      {mutation.isLoading ? ( 
        'Adding new product...'
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}

          {mutation.isSuccess ? <div>new product added</div> : null}

          <button
            onClick={() =>  handleCreate( inputEl.current.value ) }
          >
            Add Product
          </button>
          
          
        </>
      )}
    </div>


    </>
  )
}

export default App
