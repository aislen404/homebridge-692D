//https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index

//8dd53b6876e456e2fcd070ae4375e557aa3c1fd4f7dfed9cab1ec7a53518cb6a -> Ther_Salon : Thermostat Salon 
//0bdc04c8963997e28b3b8f2bb83e47cc4767182716b101ab68f4f16854215a09 -> Humi_Salon : Humidity Salon
//90e6c96c49e88c726d335c7d289213d0ec350f14f182dfe10612c2ba6c35fcd4 -> Ther_Princ : Thermostat Principal Room
//e1d01283424bc7e7b27d1276c0bac2fc0e8487c63eb0f8cb2e344bcf51e8a436 -> Humi_Princ : Humidity Principal Room
//cad44d3752fd7e1bcdc222aef05b82384ce4490af16a3b19f022f2c6aeced101 -> Ther_Guest : Thermostat Guest Room
//6c5b5d86f8ae46bb79ae5493d1988dfd451b6a6c0a5bbd11d292cb5e7ddf0763 -> Humi_Guest : Humidity Guest Room

const axios = require('axios')

const { homeBridgeAPIUrl, homeBridgeUser,homeBridgePswrd } = require('./config.json');

const uuids= ['8dd53b6876e456e2fcd070ae4375e557aa3c1fd4f7dfed9cab1ec7a53518cb6a',
'90e6c96c49e88c726d335c7d289213d0ec350f14f182dfe10612c2ba6c35fcd4',
'cad44d3752fd7e1bcdc222aef05b82384ce4490af16a3b19f022f2c6aeced101',
'0bdc04c8963997e28b3b8f2bb83e47cc4767182716b101ab68f4f16854215a09',
'e1d01283424bc7e7b27d1276c0bac2fc0e8487c63eb0f8cb2e344bcf51e8a436',
'6c5b5d86f8ae46bb79ae5493d1988dfd451b6a6c0a5bbd11d292cb5e7ddf0763'];

var token;

const getLogin = async () => {
  try {
    return await axios({
        url: homeBridgeAPIUrl + 'auth/login',
        method: 'POST',
        data:{
          username: homeBridgeUser,
          password: homeBridgePswrd
        }
    })
  } catch (error) {
    console.error(error.response.data)
  }
}

const getAccesories = async (uuid) => {

  try {
    return await axios({
        url: homeBridgeAPIUrl + 'accessories/' + uuid,
        method: 'GET',
        headers: {
          'Authorization': ` Bearer ${token}` 
        }
    })
    
  } catch (error) {
    console.error(error.response.data)
  }
}

const runApp = async () => {

  const loginChain = await getLogin()
  if (loginChain) {
    token = loginChain.data.access_token
    
    for (let uuid of uuids) {
      const accesorie = await getAccesories(uuid)
      if(accesorie) {

        if (accesorie.data.values.CurrentTemperature === undefined) {
          measure = accesorie.data.values.CurrentRelativeHumidity
          unit = 'percentage'
        }else{
          measure = accesorie.data.values.CurrentTemperature
          unit = 'celsius'
        }

        console.log(
          'Device: ' + accesorie.data.humanType + '\n' + 
          'Room: '  + accesorie.data.serviceName + '\n' + 
          'Measure: '  + measure  + '\n' + 
          'Unit: ' + unit
        )
      }
    }

  }
}

runApp()
