<?php

namespace App\Controller\Admin;

use App\Entity\Entry;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use Vich\UploaderBundle\Form\Type\VichImageType;

class EntryCrudController extends AbstractCrudController
{

    public function __construct(string $uploadPath)
    {
        $this->uploadPath = $uploadPath;
 
    }


    public static function getEntityFqcn(): string
    {
        return Entry::class;
    }


    public function configureFields(string $pageName): iterable
    {
        $imgFile = ImageField::new('imageFile')->setFormType(VichImageType::class);
        $img = ImageField::new('img_path')->setBasePath($this->uploadPath);

        $fields =  [
            TextEditorField::new('text'),
            AssociationField::new('listItem')->setFormTypeOption("by_reference", true)
        ];

        if ($pageName == Crud::PAGE_INDEX || $pageName == Crud::PAGE_DETAIL) {
            $fields[] = $img;
        } else {
            $fields[] = $imgFile;
        }

   

        return $fields;

    }

    public function configureActions(Actions $actions): Actions
    {
        return $actions
            // ...
            ->add(Crud::PAGE_INDEX, Action::DETAIL)
            ->add(Crud::PAGE_EDIT, Action::SAVE_AND_ADD_ANOTHER);
      
    }
   
}
