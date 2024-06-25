if(!window.filesToTest){
    window.filesToTest= {... import.meta.glob('/src/views/*.vue'),
                         ... import.meta.glob('/src/views/*.jsx'),
                         ... import.meta.glob('/src/vuejs/*.vue'),
                         ... import.meta.glob('/src/vuejs/*.jsx'),
                         ... import.meta.glob('/src/reactjs/*.jsx'),
                         ... import.meta.glob('/src/solidjs/*.jsx'),
                         ... import.meta.glob('/src/*.js'),
                         ... import.meta.glob('/tw/*.jsx')
                        };
}


export default async function getModule(name){
    let match = window.filesToTest[name];
    return match && (await match());
}
