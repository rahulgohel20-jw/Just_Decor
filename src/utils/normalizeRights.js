export const normalizeRights = (modules) => {
    const rightsMap = {};
  
    modules.forEach((module) => {
      module.userRights.forEach((page) => {
        rightsMap[page.pageName] = {
          view: page.view,
          add: page.add,
          edit: page.edit,
          delete: page.delete,
        };
      });
    });
  
    return rightsMap;
  };
  