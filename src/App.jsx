import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import './App.css'
import { useState, useRef } from 'react';





function App() {
  return(  
      <Products />  
  )

}


function Products(){
 
  const inputEl = useRef(null);
  const [ message , setMessage  ] = useState('');
  const queryClient = useQueryClient()
  

  const getProducts = () => fetch( 'https://64361a378205915d34ec0e89.mockapi.io/api/products')
                            .then( 
                            res  => res.json() ) 
  


   const query = useQuery( {
      queryKey: ['products'],
      queryFn: getProducts ,
      // staleTime: 3000, // data can remain stale for up to 5 seconds
      // cacheTime: 60000,// data will be in the cache for 1 minute 
      // refetchInterval:10000,//remove the comment , make broweser Idle, and see how it
   
    })
  

   
   const AddProduct = useMutation({
      mutationFn: ( product ) => {
        
        return fetch('https://64361a378205915d34ec0e89.mockapi.io/api/products', 
        { 
          method:'post',
          headers: {
             "Content-Type": "application/json",          
          },
          body:JSON.stringify( product )
        }).then( res =>  res.json() )
      },
    
    onMutate:() => setMessage('product adding' ),
    onSuccess: () =>  setMessage('product added' ),
    onerror :  () => setMessage( <div>An error occurred: { AddProduct.error.message }</div> )
   })
  
   const updateProduct = useMutation({
    mutationFn: ( product ) => {
      
      return fetch(`https://64361a378205915d34ec0e89.mockapi.io/api/products/${ product.id}`,
      { 
        method:'PUT',
        headers: {
           "Content-Type": "application/json",          
        },
        body:JSON.stringify( product )
      }).then(  res =>  res.json() )
    },
  
    onMutate:() => setMessage('product updating' ),
    onSuccess: () =>  setMessage('product updated' ),
    onerror :  () => setMessage( <div>An error occurred: { AddProduct.error.message }</div> )
   
  })

   const deteleProduct = useMutation({
    mutationFn: ( id ) => {
      return fetch(`https://64361a378205915d34ec0e89.mockapi.io/api/products/${ id} `, 
      { 
        method:'DELETE',
        
      }).then(  res =>  res.json())
    },
    
    onMutate:() => setMessage('product deleting' ),
    onSuccess: () =>  setMessage('product deleted' ),
    onerror :  () => setMessage( <div>An error occurred: { AddProduct.error.message }</div> )
 })



  
  if ( query.isLoading) return 'Loading...';
  if ( query.isError) return 'An error has occurred: ' + query.error;


 


  queryClient.invalidateQueries(['products'])// for invalidating query results after adding, updating and deleting API data




  
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
        <button onClick={ ()=>updateProduct.mutate( { id:product.id , name: inputEl.current.value } )}>update</button>
        </li>
      
        
        ) 
        }
      </ul>
          
      <div>
     
          <p>{  message }</p>
          <button
            onClick={() => {
              AddProduct.mutate({ name: inputEl.current.value } )
            }}
          >
            Add Product
          </button>
          
          
      
    </div>


    </>
  )
}

export default App
