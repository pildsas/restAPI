<?php

namespace App\Listener;

use App\Entity\ListItem;
use Symfony\Component\Security\Core\Security;
use Doctrine\Persistence\Event\LifecycleEventArgs;

class AddUserListener
{
   private $security;

   public function __construct(Security $security)
   {
       $this->security = $security;
   }

   public function prePersist(LifecycleEventArgs $args)
   {
      $entity = $args->getObject();
      
      if (!$entity instanceof ListItem) {
         return;
      }
      
      $em = $args->getObjectManager();

      $user = $this->security->getUser();
      $entity->setUser($user);

      // $profile = new Profile;
      // $entity->setProfile($profile);
      // dump($args);
      // $em->persist($entity);
      // $em->flush();
   }
}
