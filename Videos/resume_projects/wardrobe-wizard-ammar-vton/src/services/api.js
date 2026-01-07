import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

export const getProducts = async () => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
    };

    export const addToCart = async (product) => {
    await axios.post(`${API_URL}/cart`, product);
    };

    export const addToWishlist = async (product) => {
    await axios.post(`${API_URL}/wishlist`, product);
};
