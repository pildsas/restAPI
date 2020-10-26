<?php

namespace App\Entity;

use App\Repository\EntryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpFoundation\File\File;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\MaxDepth;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
/**
 * @ORM\Entity(repositoryClass=EntryRepository::class)
 * @ORM\HasLifecycleCallbacks()
 * @Vich\Uploadable
 * @ApiResource(
 * normalizationContext={"groups"={"read"}},
 * denormalizationContext={"groups"={"write"}},
 * )
 */
class Entry
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"read","write"})
     */
    private $id;

    /**
     * @ORM\Column(type="text")
     * @Assert\NotBlank(message = "Field cannot be empty")
     * @Groups({"read","write"})
     */
    private $text;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"read","write"})
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"read","write"})
     */
    private $updatedAt;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"read","write"})
     */
    private $imgPath;

    /**
     * @Vich\UploadableField(mapping="entries_image", fileNameProperty="imgPath")
     * @Assert\File(
     *     maxSize = "5000k",
     *     mimeTypes = {"image/jpeg", "image/png"},
     *     mimeTypesMessage = "Please upload a valid .jpeg / .png image"
     * )
     * @var File
     */
    private $imageFile;

    /**
     * @ORM\ManyToOne(targetEntity=ListItem::class, inversedBy="entries")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\NotNull(message = "Field cannot be empty")
     * @Groups({"read","write"})
     */
    private $listItem;



    public function getId(): ?int
    {
        return $this->id;
    }


    public function getText(): ?string
    {
        return $this->text;
    }

    public function setText(string $text): self
    {
        $this->text = $text;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    /** 
     * @ORM\PrePersist
     */
    public function setCreatedAt(): self
    {
        $this->createdAt = new \DateTime();
        $this->updatedAt = new \DateTime();

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getImgPath(): ?string
    {
        return $this->imgPath;
    }

    public function setImgPath(?string $imgPath): self
    {
        $this->imgPath = $imgPath;

        return $this;
    }

    public function getListItem(): ?ListItem
    {
        return $this->listItem;
    }

    public function setListItem(?ListItem $listItem): self
    {
        $this->listItem = $listItem;

        return $this;
    }

    public function __toString()
    {
        return $this->title;
    }

    public function setImageFile(File $image = null)
    {
        $this->imageFile = $image;

        // VERY IMPORTANT:
        // It is required that at least one field changes if you are using Doctrine,
        // otherwise the event listeners won't be called and the file is lost
        if ($image) {
            // if 'updatedAt' is not defined in your entity, use another property
            $this->updatedAt = new \DateTime('now');
        }
    }

    public function getImageFile()
    {
        return $this->imageFile;
    }


}
