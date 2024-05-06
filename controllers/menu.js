import MenuItem from "../models/MenuItem.js"


// get menu
export const getMenu = async (req, res) => {
    try {
        const menu = await MenuItem.find();
        res.status(200).json(menu);

    } catch (e) {
        res.status(500).json({ error: e.message })
    }
}

// register menu item
export const addMenuItem = async (req, res) => {
    try {
        const {
            name,
            description,            
            picturePath,            
            price,
            category,
        } = req.body;
        const newMenuItem = new MenuItem({
            name,
            description,            
            picturePath: picturePath[1],            
            price,
            category
        });
        const savedMenuItem = await newMenuItem.save();
        res.status(201).json(savedMenuItem);
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
}

export const deleteMenuItem = (req, res) => {
    const id = req.params.id;
  
    MenuItem.findByIdAndDelete(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Item with id=${id}. Maybe Item was not found!`
          });
        } else {
          res.send({
            message: "Item was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Item with id=" + id
        });
      });
  };