<?php

namespace App\EventSubscriber;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\ListItem;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class AddUserToListItemSubscriber implements EventSubscriberInterface
{

    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    public function addOwner(ViewEvent $event)
    {

        $list_item = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$list_item instanceof ListItem || Request::METHOD_POST !== $method){
            return;
        }

        $user = $this->security->getUser();
        $list_item->setUser($user);


    }

    public static function getSubscribedEvents()
    {
        return [
            // ViewEvent::class => 'onViewEvent',
            KernelEvents::VIEW => ['addOwner', EventPriorities::PRE_WRITE],
        ];
    }
}
