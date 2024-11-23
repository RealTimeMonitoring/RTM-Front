import { storageService } from "../../utils/Storage";
import { API_URL } from "../../utils/Util";

export async function logout() 
{
    try 
    {
        const auth = JSON.parse( await storageService.getItem('activeUser') ?? '');
        const response = await fetch(`${API_URL}/auth/logout`, 
        {
            method: 'POST',
            headers: 
            {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth?.token}`,
            },
        });

        if (!response.ok) 
        {
            throw new Error('Erro ao fazer logout');
        }
        
        await storageService.removeItem('activeUser');
    }

    catch (error) 
    {
        console.error('Erro ao fazer logout:', error);
        throw error;
    }    
}