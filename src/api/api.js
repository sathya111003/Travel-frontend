import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://travel-backend-final.onrender.com/api'
    // baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
});

// Add a request interceptor for tokens
API.interceptors.request.use((req) => {
    if (localStorage.getItem('userInfo')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`;
    }
    return req;
});

export const fetchPackages = () => API.get('/packages');
export const fetchPackageDetails = (id) => API.get(`/packages/${id}`);
export const createBooking = (bookingData) => API.post('/bookings', bookingData);
export const fetchMyBookings = () => API.get('/bookings/mybookings');
export const login = (formData) => API.post('/users/login', formData);
export const signup = (formData) => API.post('/users', formData);

// Admin API
export const fetchAllPackagesAdmin = () => API.get('/packages');
export const createPackage = (pkgData) => API.post('/packages', pkgData);
export const updatePackage = (id, pkgData) => API.put(`/packages/${id}`, pkgData);
export const deletePackage = (id) => API.delete(`/packages/${id}`);

export const fetchAllBookings = () => API.get('/bookings');
export const fetchAllUsers = () => API.get('/users');
export const fetchAllEnquiries = () => API.get('/enquiries');
export const createEnquiry = (enquiryData) => API.post('/enquiries', enquiryData);

// Reviews API
export const fetchReviews = (packageId) => API.get(`/reviews/${packageId}`);
export const fetchAllReviews = () => API.get('/reviews');
export const createReview = (reviewData) => API.post('/reviews', reviewData);

// Recent Tours API
export const fetchRecentTours = () => API.get('/recentTours');
export const fetchRecentTourById = (id) => API.get(`/recentTours/${id}`);
export const createRecentTour = (tourData) => API.post('/recentTours', tourData);
export const updateRecentTour = (id, tourData) => API.put(`/recentTours/${id}`, tourData);
export const deleteRecentTour = (id) => API.delete(`/recentTours/${id}`);

// Destinations (Mega Menu) API
export const fetchDestinations = () => API.get('/destinations');
export const createDestination = (destData) => API.post('/destinations', destData);
export const updateDestination = (id, destData) => API.put(`/destinations/${id}`, destData);
export const deleteDestination = (id) => API.delete(`/destinations/${id}`);

// Newsletter API
export const subscribeNewsletter = (email) => API.post('/newsletter', { email });

// Upload API
export const uploadImage = (formData) => API.post('/upload/image', formData);
export const uploadVideo = (formData) => API.post('/upload/video', formData);
export const uploadAudio = (formData) => API.post('/upload/audio', formData);

export default API;
