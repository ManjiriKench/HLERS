const axios = require('axios')

const getMLScores = async(hospitals, emergencyType) => {
    try {
        const response = await axios.post('http://localhost:5001/score',{
            hospitals,
            emergencyType
        })

        if (response.ddata.success){
            return {
                ranked: response.data.data,
                recommendation: response.data.recommendation
            }
        }
        return { ranked: hospitals, recommendation: hospitals[0]}
    } catch (error) {
        console.error('ML service error:', error.message)
        return { ranked: hospitals, recommendation: hospitals[0]}
    }
        
}

module.exports= { getMLScores}