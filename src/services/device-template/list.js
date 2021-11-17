import Parse from '../../configs/parse-iot';

export default async ({ query }) => {
  try {
    console.log('query :::', query);
    let queryDevice = new Parse.Query('DeviceTemplate');

    if (query.search) {
      let nameQuery = new Parse.Query('DeviceTemplate');
      nameQuery.matches('name', `.*${query.search}.*`);

      let codeNameQuery = new Parse.Query('DeviceTemplate');
      codeNameQuery.matches('code', `.*${query.search}.*`);

      queryDevice = Parse.Query.or(nameQuery, codeNameQuery);
    }
    const findDeviceTemplate = await queryDevice
      .equalTo('isDeleted', false)
      .equalTo('isActive', true)
      .find();
    const listDeviceTemplate = await Promise.all(
      findDeviceTemplate.map(async (devicetemplate) => {
        let viewDevicetemplate = JSON.parse(JSON.stringify(devicetemplate));
        const relationParameter = await devicetemplate
          .relation('parameter')
          .query()
          .includeAll()
          .find();
        return {
          ...viewDevicetemplate,
          parameter: relationParameter,
        };
      })
    );
    return listDeviceTemplate;
  } catch (error) {
    console.log('error', error);
  }
};
