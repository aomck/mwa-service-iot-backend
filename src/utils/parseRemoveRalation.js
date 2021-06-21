import Parse from "../configs/parse-iot";

export const addRelationToNewObj = async ({
  baseClassName,
  data,
  subClassName,
  nameRelation,
}) => {
  const mainClassQuery = Parse.Object.extend(baseClassName);
  const mainClass = new mainClassQuery();

  const subClass = await new Parse.Query(subClassName)
    .containedIn("objectId", data)
    .find();
  for await (let objecIdAdd of subClass) {
    mainClass.relation(nameRelation).add(objecIdAdd);
  }
  await mainClass.save();
  return true;
};

export const addRelation = async ({
  baseClassName,
  id,
  data,
  subClassName,
  nameRelation,
}) => {
  const mainClass = await new Parse.Query(baseClassName)
    .equalTo("objectId", id)
    .first();

  const subClass = await new Parse.Query(subClassName)
    .containedIn("objectId", data)
    .find();
  for await (let objecIdAdd of subClass) {
    mainClass.relation(nameRelation).add(objecIdAdd);
  }
  await mainClass.save();
  return true;
};

export const removeRelation = async ({
  baseClassName,
  id,
  data,
  nameRelation,
}) => {
  const mainClass = await new Parse.Query(baseClassName)
    .equalTo("objectId", id)
    .first();
  for await (let objecIdRemove of data) {
    mainClass.relation(nameRelation).remove(objecIdRemove);
  }
  await mainClass.save();
  return true;
};

//--- function to remove item from array : arrayName.remove(element)
Array.prototype.remove = function () {
  var what,
    a = arguments,
    L = a.length,
    ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

//--- Delete relation and returen deleted ids
export const deleteRelation = async ({
  baseClassName,
  id,
  data,
  nameRelation,
}) => {
  const mainClass = await new Parse.Query(baseClassName)
    .equalTo("objectId", id)
    .first();
  for await (let objecIdRemove of data) {
    mainClass.relation(nameRelation).remove(objecIdRemove);
  }
  await mainClass.save();
  return data.map((item) => item.id);
};

//--- Update relation with given ids and return the deleted ids
export const updateRelation = async ({
  baseClassName,
  id,
  nameRelation,
  subClassName,
  itemIds,
}) => {
  let deletedIds;
  await new Parse.Query(baseClassName).get(id).then(async (result) => {
    const nameRelationObj = await result.attributes[nameRelation]
      .query()
      .find();
    if (nameRelationObj.length !== 0) {
      const payload = {
        baseClassName: baseClassName,
        id: id,
        data: nameRelationObj,
        nameRelation: nameRelation,
      };
      deletedIds = await deleteRelation(payload);
    } else deletedIds = [];
  });

  if (itemIds.length !== 0) {
    await addRelation({
      baseClassName: baseClassName,
      id: id,
      data: itemIds,
      nameRelation: nameRelation,
      subClassName: subClassName,
    });
  }

  // console.log("before -- ",deletedIds)
  itemIds.map((id) => {
    deletedIds.remove(id);
  });
  // console.log("after -- ",deletedIds)

  return deletedIds;
};
