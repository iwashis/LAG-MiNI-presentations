---
theme: default
title: Systems of linear equations
transition: slide-left
class: cover
fonts:
  provider: none
---

<div class="kicker">Linear Algebra · Warsaw University of Technology</div>

# Systems of linear equations

<div class="subtitle">Lecture 5 · Tomasz Brengos</div>

---
class: section-slide
transition: fade
---

<div class="sec-num">01</div>

<div class="kicker">Section 01</div>

# Motivation

---

# The oldest problem in linear algebra

Chinese mathematicians were row reducing two thousand years ago. Measured in CPU-hours, solving linear
systems may be the computation the world performs most.

<v-click>

<v-clicks>

- **GPS.** Your position solves a small linear system from satellite distances — several times a second.
- **Graphics and game physics.** Ray–surface intersections and toppling crates: thousands of
  linear systems per frame.
- **Electronics.** Kirchhoff's laws turn a circuit into a linear system; SPICE is a linear-system
  solver at heart.
- **Medical imaging.** A CT scan reconstructs tissue densities by solving one huge linear system.

</v-clicks>

</v-click>

---

# Gaussian elimination

This chapter presents *Gaussian elimination* — provably correct, fast ($\sim\tfrac23 n^3$ operations),
and universal.

<v-click>

<div class="thm rem">

<span class="lbl">Remark</span>

A linear system has no solution, exactly one, or infinitely many — never, say, exactly two. The
Kronecker--Capelli theorem decides which by comparing two ranks. In the infinite case, solutions organise
as one particular solution plus a *subspace* — the abstract theory of the previous chapters paying
off directly.

</div>

</v-click>

---
class: section-slide
transition: fade
---

<div class="sec-num">02</div>

<div class="kicker">Section 02</div>

# Systems of linear equations

---

# Definition

<div class="thm def">

<span class="lbl">Definition</span>

A *system of $m$ linear equations in $n$ unknowns* $x_1,\ldots,x_n$:

$$
a_{11}x_1+\ldots+a_{1n}x_n = b_1, \ \ldots, \ a_{m1}x_1+\ldots+a_{mn}x_n=b_m, \qquad a_{ij},b_i\in\K.
$$

</div>

<v-click>

<div class="thm ex">

<span class="lbl">Example</span>

$\{\,3x+y+z=1,\ x+y=0\,\}$ has two equations, three unknowns; $(0,0,1)$ and $(-1,1,3)$ both solve it. By
contrast $\{\,x+y=1,\ x+y=0\,\}$ has *no* solution — it forces $0=1$.

</div>

</v-click>

---

# Matrix form

<div class="thm rem">

<span class="lbl">Observation</span>

$AX=B$, where

$$
A = \left(\begin{smallmatrix} a_{11}&\ldots&a_{1n}\\ \vdots&&\vdots\\ a_{m1}&\ldots&a_{mn}\end{smallmatrix}\right), \quad
X = \left(\begin{smallmatrix} x_1\\ \vdots\\ x_n\end{smallmatrix}\right), \quad
B = \left(\begin{smallmatrix} b_1\\ \vdots\\ b_m\end{smallmatrix}\right).
$$

</div>

<v-click>

<div class="thm def">

<span class="lbl">Definition</span>

Two systems are *equivalent* if they have the same solution set. The *augmented matrix*
$(A\mid B)$ packages a system into a single matrix.

</div>

</v-click>

<v-click>

<div class="thm theo">

<span class="lbl">Theorem</span>

$A_1X=B_1$ and $A_2X=B_2$ are equivalent iff $(A_1\mid B_1)$ and $(A_2\mid B_2)$ are row equivalent.

</div>

</v-click>

---
class: section-slide
transition: fade
---

<div class="sec-num">03</div>

<div class="kicker">Section 03</div>

# Solving systems

---

# Gaussian elimination, the recipe

<div class="thm theo">

<span class="lbl">Theorem</span>

To solve $AX=B$: write $(A\mid B)$; row reduce to echelon form $(A'\mid B')$; read off solutions of
$A'X=B'$ from the bottom equation up (*back substitution*).

</div>

<v-click>

<div class="thm def">

<span class="lbl">Definition</span>

In an echelon system, unknowns multiplying leading entries are *leading variables*; the rest are
*free variables*, assigned arbitrary parameters.

</div>

</v-click>

---

# A unique solution

<StepThrough :steps="['\\left(\\begin{smallmatrix} 2&4&-1&11\\\\-4&-3&3&20\\\\2&4&2&2 \\end{smallmatrix}\\right)', '\\left(\\begin{smallmatrix} 2&4&-1&11\\\\0&5&1&2\\\\0&0&3&-9 \\end{smallmatrix}\\right)', 'z=-3', 'y=1', 'x=2']" :captions="['augmented matrix', 'row reduce to echelon form', 'back substitute: 3z=-9', 'then 5y+z=2', 'then 2x+4y-z=11']" />

---

# Infinitely many solutions

<StepThrough :steps="['\\left(\\begin{smallmatrix} 1&4&-3&2&5\\\\2&8&-5&0&12 \\end{smallmatrix}\\right)', '\\left(\\begin{smallmatrix} 1&4&-3&2&5\\\\0&0&1&-4&2 \\end{smallmatrix}\\right)', 'z=2+4b,   x=11-4a+10b']" :captions="['augmented matrix, 2 eqns, 4 unknowns', 'echelon form', 'y,t free — set y=a, t=b']" />

<v-click>

The solution depends on two free parameters $a,b$.

</v-click>

---

# No solution

<StepThrough :steps="['\\left(\\begin{smallmatrix} 2&4&0\\\\2&4&1 \\end{smallmatrix}\\right)', '\\left(\\begin{smallmatrix} 2&4&0\\\\0&0&1 \\end{smallmatrix}\\right)']" :captions="['augmented matrix', 'R2 - R1: the bottom row reads 0 = 1']" />

<v-click>

No solutions. This is the geometric picture of a $2\times 2$ system: two lines in the plane, either
crossing once, never, or coinciding.

</v-click>

<v-click>

<div class="widget"><TwoLines  /></div>

</v-click>

---

# Kronecker--Capelli

<div class="thm theo">

<span class="lbl">Theorem</span>

$AX=B$ has a solution iff $\rank(A)=\rank(A\mid B)$.

</div>

<v-click>

<div class="thm theo">

<span class="lbl">Corollary</span>

For a solvable system with $n$ unknowns and $r=\rank(A)$: if $r=n$, exactly one solution; if $r<n$, $n-r$
free parameters — infinitely many solutions over $\R$ or $\C$, exactly $p^{n-r}$ over $\Z_p$.

</div>

</v-click>

---

# A system with a parameter

For which $p\in\R$ does $\{\,x+y+z=1,\ x+2y+3z=2,\ 2x+3y+4z=p\,\}$ have solutions?

<v-click>

<StepThrough :steps="['\\left(\\begin{smallmatrix}1&1&1&1\\\\1&2&3&2\\\\2&3&4&p\\end{smallmatrix}\\right) \\to \\left(\\begin{smallmatrix}1&1&1&1\\\\0&1&2&1\\\\0&1&2&p-2\\end{smallmatrix}\\right)', '\\left(\\begin{smallmatrix}1&1&1&1\\\\0&1&2&1\\\\0&0&0&p-3\\end{smallmatrix}\\right)']" :captions="['row reduce', 'R3-R2: bottom row is 0 = p-3']" />

</v-click>

<v-click>

If $p\neq 3$: no solutions ($\rank(A)=2 < 3 = \rank(A\mid B)$). If $p=3$: infinitely many, $z=a$,
$y=1-2a$, $x=a$.

</v-click>

---
class: section-slide
transition: fade
---

<div class="sec-num">04</div>

<div class="kicker">Section 04</div>

# Homogeneous systems

---

# Always at least one solution

<div class="thm def">

<span class="lbl">Definition</span>

A system is *homogeneous* if it has the form $AX=\0$; it always has the trivial solution $X=\0$. Any
other solution is *non-trivial*.

</div>

<v-click>

<div class="thm rem">

<span class="lbl">Fact</span>

A homogeneous system with $m<n$ (fewer equations than unknowns) always has a non-trivial solution: after
row reduction, $\rank(A)\leq m<n$ leaves at least one free variable.

</div>

</v-click>

---

# Two contrasting examples

<div class="thm ex">

<span class="lbl">Example</span>

$\{x+y-z=0,\ 2x-3y+z=0,\ x-4y+2z=0\}$ reduces to $\{x+y-z=0,\ -5y+3z=0\}$: setting $z=a$ gives
$y=\tfrac35 a$, $x=\tfrac25 a$ — a non-trivial solution.

</div>

<v-click>

<div class="thm ex">

<span class="lbl">Example</span>

$\{x+y-z=0,\ 2x+4y-z=0,\ 3x+2y+2z=0\}$ reduces to $\{x+y-z=0,\ 2y+z=0,\ 11z=0\}$: only the trivial solution
$x=y=z=0$.

</div>

</v-click>

---

# The solution space

<div class="thm theo">

<span class="lbl">Theorem</span>

$W=\{\vv\in\K^n\mid A\vv=\0\}$ is a subspace of $\K^n$, and $\dim(W)=n-\rank(A)$.

</div>

<v-click>

<div class="thm rem">

<span class="lbl">Proof</span>

$A(\vv_1+\vv_2)=A\vv_1+A\vv_2=\0$ and $A(k\vv_1)=kA\vv_1=\0$: closure under $+$ and scaling. ∎

</div>

</v-click>

<v-click>

<div class="thm rem">

<span class="lbl">Remark</span>

Visible in the algorithm: elimination leaves $\rank(A)$ leading and $n-\rank(A)$ free variables; setting one
free variable to $1$ and the rest to $0$ produces a basis of $W$.

</div>

</v-click>

---

# Building a basis of the solution space

For $\{x+2y+3z=0,\ -2x-4y-6z=0\}$, which reduces to the single equation $x+2y+3z=0$:

<v-click>

<StepThrough :steps="['\\left(\\begin{smallmatrix}x\\\\y\\\\z\\end{smallmatrix}\\right) = \\left(\\begin{smallmatrix}-2a-3b\\\\a\\\\b\\end{smallmatrix}\\right)', '\\left(\\begin{smallmatrix}-2\\\\1\\\\0\\end{smallmatrix}\\right),   \\left(\\begin{smallmatrix}-3\\\\0\\\\1\\end{smallmatrix}\\right)']" :captions="['free variables y=a, z=b', '(a,b)=(1,0) and (0,1) give a basis']" />

</v-click>

---
class: section-slide
transition: fade
---

<div class="sec-num">05</div>

<div class="kicker">Section 05</div>

# Homogeneous and non-homogeneous

---

# Particular solution plus the homogeneous space

<div class="thm theo">

<span class="lbl">Theorem</span>

For $AX=B$ with solution set $U$ and any particular solution $\vv_0\in U$:

$$
U = \vv_0 + W = \{\vv_0+\ww \mid \ww\in W\},
$$

where $W$ solves the associated homogeneous system $AX=\0$.

</div>

<v-click>

<div class="thm rem">

<span class="lbl">Proof</span>

$A(\vv_0+\ww)=A\vv_0+A\ww=B+\0=B$, so $\vv_0+W\subseteq U$. Conversely if $A\vv=B$, put $\ww=\vv-\vv_0$:
$A\ww=B-B=\0$, so $\vv=\vv_0+\ww\in\vv_0+W$. ∎

</div>

</v-click>

---

# Example

<div class="thm ex">

<span class="lbl">Example</span>

$x+2y+3z=6$: a particular solution $\vv_0=(1,1,1)$; the homogeneous space
$W=\Span{\{(-2,1,0),\,(-3,0,1)\}}$. Every solution is

$$
(1,1,1) + a(-2,1,0) + b(-3,0,1), \qquad a,b\in\R.
$$

</div>

---

# Summary

<v-clicks>

- Every system $AX=B$ reduces, via elementary row operations, to echelon form.
- Kronecker--Capelli: solvable iff $\rank(A)=\rank(A\mid B)$; then $n-r$ free parameters.
- Homogeneous solution sets are subspaces of dimension $n-\rank(A)$.
- General solutions are a particular solution plus that subspace.
- **Next lecture:** the determinant — a single number that tests solvability at a glance.

</v-clicks>
