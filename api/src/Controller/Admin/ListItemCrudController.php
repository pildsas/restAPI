<?php

namespace App\Controller\Admin;

use App\Entity\ListItem;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class ListItemCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return ListItem::class;
    }

  
    public function configureFields(string $pageName): iterable
    {
        $fields = [
            TextField::new('title'),
          
        ];

        if ($pageName == Crud::PAGE_INDEX){
            $entries_count_field = AssociationField::new('entries');
            $user_field = AssociationField::new('user');
            $fields[] = $user_field;
            $fields[] = $entries_count_field;
        }

        return $fields;
    }

    public function configureActions(Actions $actions): Actions
    {
        return $actions
            // ...
            ->update(Crud::PAGE_INDEX, Action::NEW, function (Action $action) {
                return $action->setLabel("Add Item");
            });
      
    }
 
}


