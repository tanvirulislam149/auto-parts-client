import React, { useEffect, useState } from 'react';
import DeleteModal from '../DeleteModal';

const ManageAllOrders = () => {
    const [allOrders, setAllOrders] = useState([]);
    const [modal, setModal] = useState(false);
    const [id, setId] = useState();
    useEffect(() => {
        fetch("http://localhost:5000/allOrders")
            .then(res => res.json())
            .then(data => setAllOrders(data));
    }, [])

    const handleShipped = (id) => {
        fetch(`http://localhost:5000/shipped/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.acknowledged) {
                    fetch("http://localhost:5000/allOrders")
                        .then(res => res.json())
                        .then(data => setAllOrders(data));
                }
            });
    }


    useEffect(() => {
        if (modal) {
            fetch(`http://localhost:5000/cancelOrder/${id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.acknowledged) {
                        const remaining = allOrders.filter(o => o._id !== id);
                        setAllOrders(remaining);
                    }
                });
        }
        setModal(false);
    }, [modal, id, allOrders])


    return (
        <div>
            <div>
                <p className='text-5xl text-accent-focus my-5'>Manage All Orders</p>
                <div class="overflow-x-auto">
                    <table class="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Email</th>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                                <th>Button</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                allOrders.map((o, index) =>
                                    <>
                                        <tr key={index}>
                                            <th>{index + 1}</th>
                                            <td>{o.email}</td>
                                            <td>{o.item}</td>
                                            <td>{o.quantity}</td>
                                            <td>{o.price}</td>
                                            <td>{o.pay === "unpaid" ? <label for="deleteModal" onClick={() => setId(o._id)} className='btn btn-xs btn-error'>Cancel</label> : <button onClick={() => handleShipped(o._id)} disabled={o.status === "Shipped" && "disabled"} className='btn btn-xs btn-success'>Set For Shipment</button>}</td>
                                            <td>{o.status || "Unpaid"}</td>
                                        </tr>
                                    </>
                                )
                            }

                        </tbody>
                    </table>
                </div>
                <DeleteModal setModal={setModal}></DeleteModal>
            </div>
        </div>
    );
};

export default ManageAllOrders;