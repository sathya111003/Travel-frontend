import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPackageDetails, createBooking, fixMediaUrl } from '../api/api';
import { Calendar, Users, ArrowRight, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [persons, setPersons] = useState(1);
  const [travelDate, setTravelDate] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const { userInfo, openAuthModal } = useAuth();

  useEffect(() => {
    if (!userInfo) {
      navigate('/');
      openAuthModal('login');
      return;
    }
    const getPkg = async () => {
      try {
        const { data } = await fetchPackageDetails(id);
        setPkg(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    getPkg();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!travelDate) return alert('Please select a travel date');
    
    try {
      const bookingData = {
        packageId: id,
        travelDate,
        persons,
        totalPrice: pkg.price * persons
      };
      await createBooking(bookingData);
      setBookingSuccess(true);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (error) {
      alert(error.response?.data?.message || 'Booking failed. Please login first.');
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-background"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div></div>;

  return (
    <div className="pt-32 pb-20 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        {bookingSuccess ? (
          <div className="glass p-12 rounded-3xl text-center space-y-6">
            <div className="w-20 h-20 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto">
              <CreditCard className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold">Booking Successful!</h2>
            <p className="text-text/70">Your payment has been processed and your trip is confirmed.</p>
            <p className="text-sm text-primary">Redirecting to your dashboard...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Booking Form */}
            <div className="glass p-8 rounded-3xl space-y-8">
              <h2 className="text-2xl font-bold">Book Your Trip</h2>
              <form className="space-y-6" onSubmit={handleBooking}>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text/60 flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Select Travel Date</span>
                  </label>
                  <input 
                    type="date" 
                    required
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full bg-card border border-primary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-text"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-text/60 flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Number of Persons</span>
                  </label>
                  <div className="flex items-center space-x-4">
                    <button 
                      type="button"
                      onClick={() => setPersons(Math.max(1, persons - 1))}
                      className="w-12 h-12 glass rounded-xl flex items-center justify-center font-bold text-xl hover:text-primary transition-colors"
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold w-8 text-center">{persons}</span>
                    <button 
                      type="button"
                      onClick={() => setPersons(persons + 1)}
                      className="w-12 h-12 glass rounded-xl flex items-center justify-center font-bold text-xl hover:text-primary transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="pt-8">
                  <button 
                    type="submit"
                    className="w-full bg-primary text-background font-bold py-4 rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-primary/20"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Summary Sidebar */}
            <div className="space-y-6">
              <div className="glass p-8 rounded-3xl space-y-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <h3 className="text-xl font-bold">Trip Summary</h3>
                
                <div className="flex space-x-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    <img src={fixMediaUrl(pkg.images?.[0]) || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=200&auto=format&fit=crop'} alt={pkg.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold line-clamp-1">{pkg.title}</h4>
                    <p className="text-sm text-text/60">{pkg.duration}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-primary/10 space-y-3">
                  <div className="flex justify-between text-text/70">
                    <span>Price per person</span>
                    <span>₹{pkg.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-text/70">
                    <span>Number of persons</span>
                    <span>x {persons}</span>
                  </div>
                  <div className="flex justify-between pt-3 text-xl font-bold text-primary">
                    <span>Total Price</span>
                    <span>₹{(pkg.price * persons).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-accent/10 border border-accent/20 rounded-2xl flex items-start space-x-4">
                <div className="w-10 h-10 bg-accent/20 text-accent rounded-lg flex items-center justify-center shrink-0">
                  <CreditCard className="w-6 h-6" />
                </div>
                <p className="text-sm text-text/80">
                  Secure checkout with <strong>Razorpay</strong>. All major cards and UPI accepted.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
