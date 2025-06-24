// API utilities for better error handling and debugging
// This can be used to wrap fetch calls with better error reporting

interface APIError {
  message: string;
  status?: number;
  details?: string;
  timestamp: string;
}

export async function apiCall<T>(
  url: string, 
  options: RequestInit = {}
): Promise<T> {
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log('API Call:', { url, method: options.method || 'GET' });
    
    const response = await fetch(url, defaultOptions);
    
    console.log('API Response:', { 
      url, 
      status: response.status, 
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      let errorDetails = '';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
        errorDetails = errorData.details || '';
      } catch (parseError) {
        errorDetails = await response.text();
      }
      
      const apiError: APIError = {
        message: errorMessage,
        status: response.status,
        details: errorDetails,
        timestamp: new Date().toISOString()
      };
      
      console.error('API Error:', apiError);
      throw new Error(`${errorMessage}${errorDetails ? ` - ${errorDetails}` : ''}`);
    }
    
    const data = await response.json();
    console.log('API Success:', { url, data });
    return data;
    
  } catch (error) {
    console.error('API Call Failed:', { 
      url, 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

// Specific API functions
export const teeTimesAPI = {
  getAvailable: (date: string, courseId: string) => 
    apiCall(`/api/tee-times/available?date=${date}&courseId=${courseId}`),
  
  getMyBookings: () => 
    apiCall('/api/tee-times'),
  
  createBooking: (booking: any) => 
    apiCall('/api/tee-times', { method: 'POST', body: JSON.stringify(booking) }),
  
  updateBooking: (id: string, booking: any) => 
    apiCall(`/api/tee-times?id=${id}`, { method: 'PUT', body: JSON.stringify(booking) }),
  
  deleteBooking: (id: string) => 
    apiCall(`/api/tee-times?id=${id}`, { method: 'DELETE' }),
};

export const tennisAPI = {
  getAvailable: (date: string, courtType: string) => 
    apiCall(`/api/tennis-courts/available?date=${date}&courtType=${courtType}`),
  
  getMyReservations: () => 
    apiCall('/api/tennis-courts'),
  
  createReservation: (reservation: any) => 
    apiCall('/api/tennis-courts', { method: 'POST', body: JSON.stringify(reservation) }),
  
  deleteReservation: (id: string) => 
    apiCall(`/api/tennis-courts?id=${id}`, { method: 'DELETE' }),
};
