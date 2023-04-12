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
  

   

   const AddProduct = useMutation({
      mutationFn: ( product ) => {
        
        return fetch('https://64361a378205915d34ec0e89.mockapi.io/products', 
        { 
          method:'post',
          headers: {
             "Content-Type": "application/json",          
          },
          body:JSON.stringify( product )
        }).then( res => console.log( res))
      },
    
      
      
   })

   const updateProduct = useMutation({
    mutationFn: ( product ) => {
      
      return fetch(`https://64361a378205915d34ec0e89.mockapi.io/products/${ product.id}`,
      { 
        method:'PUT',
        headers: {
           "Content-Type": "application/json",          
        },
        body:JSON.stringify( product )
      }).then( res => console.log( res))
    },
  
   
  })

   const deteleProduct = useMutation({
    mutationFn: ( id ) => {
      return fetch(`https://64361a378205915d34ec0e89.mockapi.io/products/${ id} `, 
      { 
        method:'DELETE',
        
      }).then( res => console.log( res.json()))
    },
    
 })





 


  
  if ( query.isLoading) return 'Loading...'

  if ( query.isError) return 'An error has occurred: ' + query.error + query.status

  queryClient.invalidateQueries(['products'])
  
  return(
    <>
      <form>
          <label>product:</label><input ref={inputEl} type="text" />
         
      </form>
      <ul>
        { 
        query.data.map( product => 
        <li key={ product.id }>{ product.name }
        <button onClick={ ()=>{ deteleProduct.mutate( product.id )}}>delete</button>
        <button onClick={ ()=>updateProduct.mutate( { id:product.id , name: inputEl.current.value } )}>Update</button>
        </li>
      
        
        ) 
        }
      </ul>
          
      <div>
      {AddProduct.isLoading ? ( 
        'Adding new product...'
      ) : (
        <>
          {AddProduct.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}

          {AddProduct.isSuccess ? <div>new product added</div> : null}

          <button
            onClick={() => {
              AddProduct.mutate({ name: inputEl.current.value } )
            }}
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
