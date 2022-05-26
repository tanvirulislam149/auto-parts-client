import React, { useEffect, useState } from 'react';
import DeleteModal from '../DeleteModal';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [modal, setModal] = useState(false);
    const [id, setId] = useState();

    useEffect(() => {
        fetch("http://localhost:5000/parts")
            .then(res => res.json())
            .then(data => setProducts(data));
    }, [])


    useEffect(() => {
        if (modal) {
            fetch(`http://localhost:5000/deleteProduct/${id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.acknowledged) {
                        const remaining = products.filter(o => o._id !== id);
                        setProducts(remaining);
                    }
                });
        }
        setModal(false);
    }, [modal, id, products])



    return (
        <div>
            <p className='text-5xl text-accent-focus my-5'>Manage Products</p>
            <div class="overflow-x-auto">
                <table class="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Picture</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Button</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.map((o, index) =>
                                <>
                                    <tr key={index}>
                                        <th>{index + 1}</th>
                                        <td><img className='w-14 rounded-xl' src={o.picture} alt="" /></td>
                                        <td>{o.name?.toUpperCase()}</td>
                                        <td>${o.price}</td>
                                        <td><label for="deleteModal" onClick={() => setId(o._id)} className='btn btn-xs btn-error'>Delete Product</label></td>
                                    </tr>
                                </>
                            )
                        }

                    </tbody>
                </table>
            </div>
            <DeleteModal setModal={setModal}></DeleteModal>
        </div>
    );
};

export default ManageProducts;