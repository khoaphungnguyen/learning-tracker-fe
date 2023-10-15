import {useState, useEffect} from 'react';
import Api from "../../api"
import { requireUserSession } from '~/sessions';

export function useGoals() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      async function fetchGoals() {
        try {
          const api = new Api();
          const response = await api.getGoals();
          setData(response.data);
          setLoading(false);
        } catch (err) {
          setError(err);
          setLoading(false);
        }
      }
  
      fetchGoals();
    }, []);
  
    return { data, loading, error };
  }
  
