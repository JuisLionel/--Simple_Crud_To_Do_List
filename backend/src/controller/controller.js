import * as Services from '../services/services.js';

export const getClient = async (req, res) => {
    try {
        const data = await Services.getData();
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}

export const addClient = async (req, res) => {
    try {
        const data = req.body;
        const newData = await Services.addData(data);
        res.status(200).json(newData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add data' });
    }
}

export const updateClient = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const updateClient = await Services.updateData(id, data);

        if (!updateClient) {
            return res.status(400).json({ error: 'Client not found' });
        }

        res.status(200).json(updateClient);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to Update data' });
    }
}

export const deleteClient = async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await Services.deleteData(id);

        if (!deleted) {
            return res.status(400).json({ error: 'Client not found' });
        }

        res.status(200).send();

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to Update data' });
    }
}
